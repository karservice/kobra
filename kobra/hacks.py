# -*- coding: utf-8 -*-
import csv
import logging
from io import StringIO
import pickle

from django.conf import settings
from django.db import transaction

import cx_Oracle

from kobra.models import Student, DiscountRegistration

logger = logging.getLogger(__name__)


def manually_add_mifare_id(liu_id, mifare_id):
    s = Student.objects.get(liu_id=liu_id, use_sesam=True)
    s.mifare_id = mifare_id
    s.save()


def batch_add_mifare_id(csv_string):
    csv_io = StringIO(csv_string)
    reader = csv.DictReader(csv_io)
    for row in reader:
        print(row)
        manually_add_mifare_id(row['liu_id'], row['mifare_id'])


@transaction.atomic()
def update_student_ids():
    def serialize_all_discount_registrations():
        return pickle.dumps(list(DiscountRegistration.objects.all().values(
            'id', 'discount_id', 'timestamp', 'student__liu_id'
        )))

    start_discount_registrations = serialize_all_discount_registrations()

    for student in Student.objects.all():
        print(student.liu_id)
        new_pk = settings.SESAM_STUDENT_SERVICE_CLIENT.get_student(liu_id=student.liu_id).nor_edu_person_lin
        old_pk = student.pk
        if new_pk != old_pk:
            discount_registrations = student.discount_registrations.all()
            student.pk = new_pk
            student.save()
            discount_registrations.update(student=student)
            Student.objects.get(pk=old_pk).delete()

    end_discount_registrations = serialize_all_discount_registrations()

    assert end_discount_registrations == start_discount_registrations


def import_mifare_ids():
    connection = cx_Oracle.connect(
        '{user}/{password}@{host}:{port}/sharedsvc'.format(
            user=settings.ORACLE_USERNAME, password=settings.ORACLE_PASSWORD,
            host=settings.ORACLE_HOST, port=settings.ORACLE_PORT))
    cursor = connection.cursor()
    cursor.execute("""
        SELECT
          SUBSTR(EPOST, 0, INSTR(EPOST, '@') - 1) AS liu_id,
          RFIDNR AS mifare_id
        FROM LIUKORT.STUDENTKOLL WHERE
          RFIDNR IS NOT NULL AND
          GILTIG_TILL > CURRENT_TIMESTAMP
    """)
    for result in cursor:
        print(result)
        try:
            student = Student.objects.get_with_sesam(liu_id=result[0])
            student.mifare_id = result[1]
            student.save()
        except Student.DoesNotExist:
            logger.warning('Student in Oracle not found in Sesam: {}'.format(result), exc_info=True)
    cursor.close()
    connection.close()
