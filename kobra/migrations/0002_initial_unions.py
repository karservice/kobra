# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import IntegrityError, migrations, models


DEFAULT_UNIONS = [
    'Consensus',
    'LinTek',
    'StuFF'
]


def create_unions(apps, schema_editor):
    Union = apps.get_model('kobra', 'Union')

    for union in DEFAULT_UNIONS:
        try:
            Union.objects.create(name=union)
        except IntegrityError:
            pass


def delete_unions(apps, schema_editor):
    Union = apps.get_model('kobra', 'Union')

    for union in DEFAULT_UNIONS:
        try:
            Union.objects.get(name=union).delete()
        except Union.DoesNotExist:
            pass


class Migration(migrations.Migration):

    dependencies = [
        ('kobra', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_unions, delete_unions)
    ]
