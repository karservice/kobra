# -*- coding: utf-8 -*-
from django.contrib.auth.models import Permission
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from .... import factories, models


class OrganizationApiTests(APITestCase):
    def test_list_unauthenticated(self):
        url = reverse('v1:organization-list')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_authenticated_unowned(self):
        url = reverse('v1:organization-list')
        user = factories.UserFactory()
        unowned_organization = factories.OrganizationFactory()

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_authenticated_owned(self):
        url = reverse('v1:organization-list')
        user = factories.UserFactory()
        owned_organization = factories.OrganizationFactory()
        owned_organization.admins.add(user)
        unowned_organization = factories.OrganizationFactory()

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], str(owned_organization.id))

    def test_create_unauthenticated(self):
        url = reverse('v1:organization-list')

        # I'm lazy. Let's use the factory, but don't save the object.
        temp_organization = factories.OrganizationFactory.build()
        request_data = {
            'name': temp_organization.name
        }

        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_authenticated_unauthorized(self):
        url = reverse('v1:organization-list')
        user = factories.UserFactory()

        # I'm lazy. Let's use the factory, but don't save the object.
        temp_organization = factories.OrganizationFactory.build()
        request_data = {
            'name': temp_organization.name
        }
        self.client.force_authenticate(user)
        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_authenticated_authorized(self):
        url = reverse('v1:organization-list')
        user = factories.UserFactory()
        permission = Permission.objects.get(codename='add_organization')
        user.user_permissions.add(permission)
        self.assertEqual(user.has_perm('kobra.add_organization'), True)

        # I'm lazy. Let's use the factory, but don't save the object.
        temp_organization = factories.OrganizationFactory.build()
        request_data = {
            'name': temp_organization.name
        }

        self.client.force_authenticate(user)
        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_unauthenticated(self):
        organization = factories.OrganizationFactory()
        url = reverse('v1:organization-detail', kwargs={'pk': organization.pk})

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_authenticated_unowned(self):
        user = factories.UserFactory()
        organization = factories.OrganizationFactory()
        url = reverse('v1:organization-detail', kwargs={'pk': organization.pk})

        self.client.force_authenticate(user)
        response = self.client.get(url)
        # Authenticated requests should be treated as 404 when retrieving an
        # unowned event
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_authenticated_owned(self):
        user = factories.UserFactory()
        organization = factories.OrganizationFactory()
        organization.admins.add(user)
        url = reverse('v1:organization-detail', kwargs={'pk': organization.pk})

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], str(organization.id))

    def test_update_unauthenticated(self):
        organization = factories.OrganizationFactory()
        url = reverse('v1:organization-detail', kwargs={'pk': organization.pk})

        new_organization = factories.OrganizationFactory.build()

        # Request with changed organization
        request_data = {
            'name': new_organization.name
        }

        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_authenticated_unowned(self):
        user = factories.UserFactory()
        organization = factories.OrganizationFactory()
        url = reverse('v1:organization-detail', kwargs={'pk': organization.pk})

        new_organization = factories.OrganizationFactory.build()

        # Request with changed organization
        request_data = {
            'name': new_organization.name
        }

        self.client.force_authenticate(user)
        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_authenticated_owned(self):
        user = factories.UserFactory()
        organization = factories.OrganizationFactory()
        organization.admins.add(user)
        url = reverse('v1:organization-detail', kwargs={'pk': organization.pk})

        new_organization = factories.OrganizationFactory.build()

        # Request with changed organization
        request_data = {
            'name': new_organization.name
        }

        self.client.force_authenticate(user)
        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_unauthenticated(self):
        organization = factories.OrganizationFactory()
        url = reverse('v1:organization-detail', kwargs={'pk': organization.pk})

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_authenticated_unauthorized(self):
        user = factories.UserFactory()
        organization = factories.OrganizationFactory()
        url = reverse('v1:organization-detail', kwargs={'pk': organization.pk})

        self.client.force_authenticate(user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_authenticated_authorized(self):
        user = factories.UserFactory()
        permission = Permission.objects.get(codename='delete_organization')
        user.user_permissions.add(permission)
        self.assertEqual(user.has_perm('kobra.delete_organization'), True)
        organization = factories.OrganizationFactory()
        url = reverse('v1:organization-detail', kwargs={'pk': organization.pk})

        self.client.force_authenticate(user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
