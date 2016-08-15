# -*- coding: utf-8 -*-
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from ....factories import (DiscountFactory, DiscountRegistrationFactory,
                           StudentFactory, UnionFactory, UserFactory)


class DiscountRegistrationApiTests(APITestCase):
    def test_list_unauthenticated(self):
        url = reverse('v1:discountregistration-list')

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_authenticated(self):
        url = reverse('v1:discountregistration-list')
        user = UserFactory()

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_authenticated_unowned(self):
        url = reverse('v1:discountregistration-list')
        user = UserFactory()
        # Creates a DiscountRegistration owned by someone else
        DiscountRegistrationFactory()

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_authenticated_owned(self):
        url = reverse('v1:discountregistration-list')
        user = UserFactory()
        owned_discount_registration = DiscountRegistrationFactory()
        owned_discount_registration.discount.ticket_type.event.organization.admins\
            .add(user)
        # Creates a DiscountRegistration owned by someone else
        DiscountRegistrationFactory()

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], str(owned_discount_registration.id))

    def test_create_unauthenticated(self):
        url = reverse('v1:discountregistration-list')

        union = UnionFactory()
        discount = DiscountFactory(union=union)
        student = StudentFactory(union=union)
        request_data = {
            'discount': reverse(
                'v1:discount-detail',
                kwargs={'pk': discount.pk}),
            'student': reverse(
                'v1:student-detail',
                kwargs={'pk': student.pk})
        }

        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_authenticated_unowned_discount(self):
        url = reverse('v1:discountregistration-list')
        user = UserFactory()

        union = UnionFactory()
        discount = DiscountFactory(union=union)
        student = StudentFactory(union=union)

        request_data = {
            'discount': reverse(
                'v1:discount-detail',
                kwargs={'pk': discount.pk}),
            'student': reverse(
                'v1:student-detail',
                kwargs={'pk': student.pk})
        }

        self.client.force_authenticate(user)
        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_authenticated_owned_discount(self):
        url = reverse('v1:discountregistration-list')
        user = UserFactory()

        union = UnionFactory()
        discount = DiscountFactory(union=union)
        discount.ticket_type.event.organization.admins.add(user)
        student = StudentFactory(union=union)

        request_data = {
            'discount': reverse(
                'v1:discount-detail',
                kwargs={'pk': discount.pk}),
            'student': reverse(
                'v1:student-detail',
                kwargs={'pk': student.pk})
        }

        self.client.force_authenticate(user)
        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_authenticated_mismatching_union(self):
        url = reverse('v1:discountregistration-list')
        user = UserFactory()

        discount_union = UnionFactory()
        student_union = UnionFactory()
        discount = DiscountFactory(union=discount_union)
        discount.ticket_type.event.organization.admins.add(user)
        student = StudentFactory(union=student_union)

        request_data = {
            'discount': reverse(
                'v1:discount-detail',
                kwargs={'pk': discount.pk}),
            'student': reverse(
                'v1:student-detail',
                kwargs={'pk': student.pk})
        }

        self.client.force_authenticate(user)
        response = self.client.post(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_retrieve_unauthenticated(self):
        discount_registration = DiscountRegistrationFactory()
        url = reverse('v1:discountregistration-detail',
                      kwargs={'pk': discount_registration.pk})

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_authenticated_unowned(self):
        user = UserFactory()
        discount_registration = DiscountRegistrationFactory()
        url = reverse('v1:discountregistration-detail',
                      kwargs={'pk': discount_registration.pk})

        self.client.force_authenticate(user)
        response = self.client.get(url)
        # Authenticated requests should be treated as 404 when retrieving an
        # unowned discount registration
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_authenticated_owned(self):
        user = UserFactory()
        discount_registration = DiscountRegistrationFactory()
        discount_registration.discount.ticket_type.event.organization.admins \
            .add(user)
        url = reverse('v1:discountregistration-detail',
                      kwargs={'pk': discount_registration.pk})

        self.client.force_authenticate(user)
        response = self.client.get(url)
        # Authenticated requests should be treated as 404 when retrieving an
        # unowned discount registration
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], str(discount_registration.id))

