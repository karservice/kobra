# -*- coding: utf-8 -*-
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from .... import factories


class EventApiTests(APITestCase):
    def test_list_unauthenticated(self):
        url = reverse('v1:event-list')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_authenticated(self):
        url = reverse('v1:event-list')
        user = factories.UserFactory()

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_authenticated_unowned(self):
        url = reverse('v1:event-list')
        user = factories.UserFactory()
        # Creates a Event "owned" by someone else
        unowned_event = factories.EventFactory()

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_authenticated_owned(self):
        url = reverse('v1:event-list')
        user = factories.UserFactory()
        owned_event = factories.EventFactory()
        owned_event.organization.admins.add(user)
        unowned_event = factories.EventFactory()

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], str(owned_event.id))

    def test_create_unauthenticated(self):
        url = reverse('v1:event-list')

        # I'm lazy. Let's use the factory, but don't save the object.
        temp_event = factories.EventFactory.build()
        request_data = {
            'name': temp_event.name,
            'organization': reverse(
                'v1:organization-detail',
                kwargs={'pk': temp_event.organization.pk})
        }

        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_authenticated_unowned_organization(self):
        url = reverse('v1:event-list')
        user = factories.UserFactory()

        # I'm lazy. Let's use the factory, but don't save the object.
        temp_event = factories.EventFactory.build()
        request_data = {
            'name': temp_event.name,
            'organization': reverse(
                'v1:organization-detail',
                kwargs={'pk': temp_event.organization.pk})
        }

        self.client.force_authenticate(user)
        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_authenticated_owned_ticket_type(self):
        url = reverse('v1:event-list')
        user = factories.UserFactory()

        owned_organization = factories.OrganizationFactory()
        owned_organization.admins.add(user)

        # I'm lazy. Let's use the factory, but don't save the object.
        temp_event = factories.EventFactory.build(
            organization=owned_organization)
        request_data = {
            'name': temp_event.name,
            'organization': reverse(
                'v1:organization-detail',
                kwargs={'pk': temp_event.organization.pk})
        }

        self.client.force_authenticate(user)
        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_unauthenticated(self):
        event = factories.EventFactory()
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_authenticated_unowned(self):
        user = factories.UserFactory()
        event = factories.EventFactory()
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        self.client.force_authenticate(user)
        response = self.client.get(url)
        # Authenticated requests should be treated as 404 when retrieving an
        # unowned event
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_authenticated_owned(self):
        user = factories.UserFactory()
        event = factories.EventFactory()
        event.organization.admins.add(user)
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], str(event.id))

    def test_update_unauthenticated(self):
        event = factories.EventFactory()
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        new_organization = factories.OrganizationFactory()

        # Request with changed organization
        request_data = {
            'name': event.name,
            'organization': reverse(
                'v1:organization-detail', kwargs={'pk': new_organization.pk}),
        }

        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_authenticated_unowned_to_unowned_organization(self):
        user = factories.UserFactory()
        event = factories.EventFactory()
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        new_organization = factories.OrganizationFactory()  # Unowned

        # Request with changed organization
        request_data = {
            'name': event.name,
            'organization': reverse(
                'v1:organization-detail', kwargs={'pk': new_organization.pk}),
        }

        self.client.force_authenticate(user)
        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_authenticated_unowned_to_owned_organization(self):
        user = factories.UserFactory()
        event = factories.EventFactory()
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        new_organization = factories.OrganizationFactory()
        new_organization.admins.add(user)

        # Request with changed organization
        request_data = {
            'name': event.name,
            'organization': reverse(
                'v1:organization-detail', kwargs={'pk': new_organization.pk}),
        }

        self.client.force_authenticate(user)
        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_authenticated_owned_to_unowned_organization(self):
        user = factories.UserFactory()
        event = factories.EventFactory()
        event.organization.admins.add(user)
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        new_organization = factories.OrganizationFactory()

        # Request with changed organization
        request_data = {
            'name': event.name,
            'organization': reverse(
                'v1:organization-detail', kwargs={'pk': new_organization.pk}),
        }

        self.client.force_authenticate(user)
        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_authenticated_owned_to_owned_organization(self):
        user = factories.UserFactory()
        event = factories.EventFactory()
        event.organization.admins.add(user)
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        new_organization = factories.OrganizationFactory()  # Unowned
        new_organization.admins.add(user)

        # Request with changed organization
        request_data = {
            'name': event.name,
            'organization': reverse(
                'v1:organization-detail', kwargs={'pk': new_organization.pk}),
        }

        self.client.force_authenticate(user)
        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_unauthenticated(self):
        event = factories.EventFactory()
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_authenticated_unowned_without_registrations(self):
        user = factories.UserFactory()
        event = factories.EventFactory()
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        self.client.force_authenticate(user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_authenticated_unowned_with_registrations(self):
        user = factories.UserFactory()
        event = factories.EventFactory()
        factories.DiscountRegistrationFactory(
            discount__ticket_type__event=event)
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        self.client.force_authenticate(user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_authenticated_owned_without_registrations(self):
        user = factories.UserFactory()
        event = factories.EventFactory()
        event.organization.admins.add(user)
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        self.client.force_authenticate(user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_authenticated_owned_with_registrations(self):
        user = factories.UserFactory()
        event = factories.EventFactory()
        event.organization.admins.add(user)
        factories.DiscountRegistrationFactory(
            discount__ticket_type__event=event)
        url = reverse('v1:event-detail', kwargs={'pk': event.pk})

        self.client.force_authenticate(user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
