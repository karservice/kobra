# -*- coding: utf-8 -*-
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from ....factories import (DiscountFactory, DiscountRegistrationFactory,
                           TicketTypeFactory, UserFactory)


class DiscountApiTests(APITestCase):
    def test_list_unauthenticated(self):
        url = reverse('v1:discount-list')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_authenticated(self):
        url = reverse('v1:discount-list')
        user = UserFactory()

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_authenticated_unowned(self):
        url = reverse('v1:discount-list')
        user = UserFactory()
        # Creates a Discount "owned" by someone else
        unowned_discount = DiscountFactory()

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_authenticated_owned(self):
        url = reverse('v1:discount-list')
        user = UserFactory()
        owned_discount = DiscountFactory()
        owned_discount.ticket_type.event.organization.admins.add(user)
        unowned_discount = DiscountFactory()

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], str(owned_discount.id))

    def test_create_unauthenticated(self):
        url = reverse('v1:discount-list')

        # I'm lazy. Let's use the factory, but don't save the object.
        temp_discount = DiscountFactory.build()
        request_data = {
            'ticket_type': reverse(
                'v1:tickettype-detail',
                kwargs={'pk': temp_discount.ticket_type.pk}),
            'union': reverse(
                'v1:union-detail', kwargs={'pk': temp_discount.union.pk}),
            'amount': temp_discount.amount
        }

        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_authenticated_unowned_ticket_type(self):
        url = reverse('v1:discount-list')
        user = UserFactory()

        # I'm lazy. Let's use the factory, but don't save the object.
        temp_discount = DiscountFactory.build()
        request_data = {
            'ticket_type': reverse(
                'v1:tickettype-detail',
                kwargs={'pk': temp_discount.ticket_type.pk}),
            'union': reverse(
                'v1:union-detail', kwargs={'pk': temp_discount.union.pk}),
            'amount': temp_discount.amount
        }

        self.client.force_authenticate(user)
        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_authenticated_owned_ticket_type(self):
        url = reverse('v1:discount-list')
        user = UserFactory()

        owned_ticket_type = TicketTypeFactory()
        owned_ticket_type.event.organization.admins.add(user)

        # I'm lazy. Let's use the factory, but don't save the object.
        temp_discount = DiscountFactory.build(ticket_type=owned_ticket_type)
        request_data = {
            'ticket_type': reverse(
                'v1:tickettype-detail',
                kwargs={'pk': temp_discount.ticket_type.pk}),
            'union': reverse(
                'v1:union-detail', kwargs={'pk': temp_discount.union.pk}),
            'amount': temp_discount.amount
        }

        self.client.force_authenticate(user)
        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_unauthenticated(self):
        discount = DiscountFactory()
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_authenticated_unowned(self):
        user = UserFactory()
        discount = DiscountFactory()
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        self.client.force_authenticate(user)
        response = self.client.get(url)
        # Authenticated requests should be treated as 404 when retrieving an
        # unowned discount
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_authenticated_owned(self):
        user = UserFactory()
        discount = DiscountFactory()
        discount.ticket_type.event.organization.admins.add(user)
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], str(discount.id))

    def test_update_unauthenticated(self):
        original_ticket_type = TicketTypeFactory()
        discount = DiscountFactory(ticket_type=original_ticket_type)
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        new_ticket_type = TicketTypeFactory()
        new_ticket_type_url = reverse('v1:tickettype-detail',
                                      kwargs={'pk': new_ticket_type.pk})

        # Request with changed ticket type
        request_data = {
            'ticket_type': new_ticket_type_url,
            'union': reverse('v1:union-detail',
                             kwargs={'pk': discount.union.pk}),
            'amount': discount.amount
        }

        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_authenticated_unowned_to_unowned_ticket_type(self):
        user = UserFactory()
        original_ticket_type = TicketTypeFactory()  # Unowned
        discount = DiscountFactory(ticket_type=original_ticket_type)
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        new_ticket_type = TicketTypeFactory()  # Unowned
        new_ticket_type_url = reverse('v1:tickettype-detail',
                                      kwargs={'pk': new_ticket_type.pk})

        # Request with changed ticket type
        request_data = {
            'ticket_type': new_ticket_type_url,
            'union': reverse('v1:union-detail',
                             kwargs={'pk': discount.union.pk}),
            'amount': discount.amount
        }

        self.client.force_authenticate(user)
        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_authenticated_unowned_to_owned_ticket_type(self):
        user = UserFactory()
        original_ticket_type = TicketTypeFactory()  # Unowned
        discount = DiscountFactory(ticket_type=original_ticket_type)
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        new_ticket_type = TicketTypeFactory()  # Owned
        new_ticket_type.event.organization.admins.add(user)
        new_ticket_type_url = reverse('v1:tickettype-detail',
                                      kwargs={'pk': new_ticket_type.pk})

        # Request with changed ticket type
        request_data = {
            'ticket_type': new_ticket_type_url,
            'union': reverse('v1:union-detail',
                             kwargs={'pk': discount.union.pk}),
            'amount': discount.amount
        }

        self.client.force_authenticate(user)
        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_authenticated_owned_to_unowned_ticket_type(self):
        user = UserFactory()
        original_ticket_type = TicketTypeFactory()  # Owned
        original_ticket_type.event.organization.admins.add(user)
        discount = DiscountFactory(ticket_type=original_ticket_type)
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        new_ticket_type = TicketTypeFactory()  # Unowned
        new_ticket_type_url = reverse('v1:tickettype-detail',
                                      kwargs={'pk': new_ticket_type.pk})

        # Request with changed ticket type
        request_data = {
            'ticket_type': new_ticket_type_url,
            'union': reverse('v1:union-detail',
                             kwargs={'pk': discount.union.pk}),
            'amount': discount.amount
        }

        self.client.force_authenticate(user)
        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_authenticated_owned_to_owned_ticket_type(self):
        user = UserFactory()
        original_ticket_type = TicketTypeFactory()  # Owned
        original_ticket_type.event.organization.admins.add(user)
        discount = DiscountFactory(ticket_type=original_ticket_type)
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        new_ticket_type = TicketTypeFactory()  # Owned
        new_ticket_type.event.organization.admins.add(user)
        new_ticket_type_url = reverse('v1:tickettype-detail',
                                      kwargs={'pk': new_ticket_type.pk})

        # Request with changed ticket type
        request_data = {
            'ticket_type': new_ticket_type_url,
            'union': reverse('v1:union-detail',
                             kwargs={'pk': discount.union.pk}),
            'amount': discount.amount
        }

        self.client.force_authenticate(user)
        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_unauthenticated(self):
        discount = DiscountFactory()
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_authenticated_unowned_without_registrations(self):
        user = UserFactory()
        discount = DiscountFactory()
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        self.client.force_authenticate(user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_authenticated_unowned_with_registrations(self):
        user = UserFactory()
        discount = DiscountFactory()
        DiscountRegistrationFactory(discount=discount)
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        self.client.force_authenticate(user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_authenticated_owned_without_registrations(self):
        user = UserFactory()
        discount = DiscountFactory()
        discount.ticket_type.event.organization.admins.add(user)
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        self.client.force_authenticate(user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_authenticated_owned_with_registrations(self):
        user = UserFactory()
        discount = DiscountFactory()
        discount.ticket_type.event.organization.admins.add(user)
        DiscountRegistrationFactory(discount=discount)
        url = reverse('v1:discount-detail', kwargs={'pk': discount.pk})

        self.client.force_authenticate(user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
