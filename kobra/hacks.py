# -*- coding: utf-8 -*-
import csv
from io import StringIO

from kobra.models import Student


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
