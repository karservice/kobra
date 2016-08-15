# -*- coding: utf-8 -*-
from django.contrib.auth.models import Permission
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from .... import factories, models


class StudentApiTests(APITestCase):
    def test_retrieve_unauthenticated(self):
        organization = factories.OrganizationFactory()
        url = reverse('v1:student-detail', kwargs={'pk': organization.pk})

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_retrieve_authenticated(self):
        user = factories.UserFactory()
        student = factories.StudentFactory()
        url = reverse('v1:student-detail', kwargs={'pk': student.pk})

        self.client.force_authenticate(user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], str(student.id))

    def test_update_unauthenticated(self):
        student = factories.StudentFactory()
        url = reverse('v1:student-detail', kwargs={'pk': student.pk})

        new_student = factories.StudentFactory.build()

        # Request with changed organization
        request_data = {
            'name': new_student.name
        }

        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_authenticated(self):
        user = factories.UserFactory()
        student = factories.StudentFactory()
        url = reverse('v1:student-detail', kwargs={'pk': student.pk})

        new_student = factories.StudentFactory.build()

        # Request with changed organization
        request_data = {
            'name': new_student.name
        }

        self.client.force_authenticate(user)
        response = self.client.put(url, data=request_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_unauthenticated(self):
        student = factories.StudentFactory()
        url = reverse('v1:student-detail', kwargs={'pk': student.pk})

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_authenticated(self):
        user = factories.UserFactory()
        student = factories.StudentFactory()
        url = reverse('v1:student-detail', kwargs={'pk': student.pk})

        self.client.force_authenticate(user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
