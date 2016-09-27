# -*- coding: utf-8 -*-
from datetime import timedelta
from unittest import mock
from uuid import UUID

from django.test import TestCase

from sesam import SesamStudent, StudentNotFound
from .. import factories
from ..models import Student


def sesam_response_factory(student):
    # Factory function useful together with StudentFactory.
    return SesamStudent(
        liu_id=student.liu_id,
        name=student.name,
        union=student.union.name if student.union else None,
        section_code=student.section.code if student.section else None,
        nor_edu_person_lin=student.id,
        liu_lin=student.liu_lin,
        email=student.email
    )


class SesamTests(TestCase):
    def test_get_no_local_no_sesam(self):
        # Without existing local entry and without Sesam match.
        with mock.patch('sesam.SesamStudentServiceClient.get_student',
                        side_effect=StudentNotFound):
            with self.assertRaises(Student.DoesNotExist):
                Student.objects.get(liu_id='oller120', use_sesam=True)

    def test_get_no_local(self):
        # Without existing local entry.
        mock_sesam_response = sesam_response_factory(
            factories.StudentFactory.build())

        with mock.patch('sesam.SesamStudentServiceClient.get_student',
                        return_value=mock_sesam_response):
            student = Student.objects.get(liu_id=mock_sesam_response.liu_id,
                                          use_sesam=True)
        student.refresh_from_db()  # Make sure the changes are persisted
        self.assertEqual(student.id, mock_sesam_response.nor_edu_person_lin)

    def test_get_with_local(self):
        # With local entry.
        original_student = factories.StudentFactory(union=None)

        new_union = factories.UnionFactory()
        # Mock response that looks like the student but now with a union
        # membership
        mock_sesam_response = sesam_response_factory(original_student)._replace(
            union=new_union.name)

        with mock.patch('sesam.SesamStudentServiceClient.get_student',
                        return_value=mock_sesam_response):
            with mock.patch('kobra.models.Student.is_outdated',
                            new_callable=mock.PropertyMock, return_value=False):
                unchanged_student = Student.objects.get(
                    id=mock_sesam_response.nor_edu_person_lin, use_sesam=True)

        self.assertEqual(unchanged_student.union, None)
        unchanged_student.refresh_from_db()
        self.assertEqual(unchanged_student.union, None)

        with mock.patch('sesam.SesamStudentServiceClient.get_student',
                        return_value=mock_sesam_response):
            with mock.patch('kobra.models.Student.is_outdated',
                            new_callable=mock.PropertyMock, return_value=True):
                changed_student = Student.objects.get(
                    id=mock_sesam_response.nor_edu_person_lin, use_sesam=True)

        self.assertEqual(changed_student.union, new_union)
        changed_student.refresh_from_db()
        self.assertEqual(changed_student.union, new_union)

    def test_get_with_local_no_sesam(self):
        # With local entry.
        student = factories.StudentFactory()

        with mock.patch('sesam.SesamStudentServiceClient.get_student',
                        side_effect=StudentNotFound):
            with mock.patch('kobra.models.Student.is_outdated',
                            new_callable=mock.PropertyMock,
                            return_value=True):
                fetched_student = Student.objects.get(pk=student.pk,
                                                      use_sesam=True)
        self.assertEqual(student.pk, fetched_student.pk)
        self.assertEqual(student.last_updated, fetched_student.last_updated)

    def test_get_updates_mifare_id(self):
        # With existing local entry.
        student = factories.StudentFactory(mifare_id=None)
        mock_sesam_response = sesam_response_factory(student)
        mifare_id = 12345678

        with mock.patch('sesam.SesamStudentServiceClient.get_student',
                        return_value=mock_sesam_response):
            student = Student.objects.get(mifare_id=mifare_id, use_sesam=True)
        self.assertEqual(student.mifare_id, mifare_id)
        student.refresh_from_db()  # Make sure the changes are persisted
        self.assertEqual(student.mifare_id, mifare_id)
