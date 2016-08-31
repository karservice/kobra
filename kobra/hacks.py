# -*- coding: utf-8 -*-
from kobra.models import Student


def manually_add_mifare_id(liu_id, mifare_id):
    s = Student.objects.get(liu_id=liu_id, use_sesam=True)
    s.mifare_id = mifare_id
    s.save()
