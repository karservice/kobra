# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-08-11 09:21
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import kobra.db_fields
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0008_alter_user_username_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('id', kobra.db_fields.IdField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', kobra.db_fields.NameField(help_text='Complete name of the user. In the case of a person, this means at least first and last names.', max_length=64, verbose_name='name')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='email address')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Discount',
            fields=[
                ('id', kobra.db_fields.IdField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', kobra.db_fields.MoneyField(decimal_places=2, max_digits=12)),
            ],
            options={
                'permissions': [['view_discount', 'Can view discount']],
            },
        ),
        migrations.CreateModel(
            name='DiscountRegistration',
            fields=[
                ('id', kobra.db_fields.IdField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('discount', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='discount_registrations', to='kobra.Discount')),
            ],
            options={
                'ordering': ['-timestamp'],
                'permissions': [['view_discountregistration', 'Can view discount registration']],
            },
        ),
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', kobra.db_fields.IdField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', kobra.db_fields.NameField(max_length=64, verbose_name='name')),
            ],
            options={
                'permissions': [['view_event', 'Can view event']],
            },
        ),
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('id', kobra.db_fields.IdField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', kobra.db_fields.NameField(max_length=64, verbose_name='name')),
                ('admins', models.ManyToManyField(related_name='organizations_administered', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'permissions': [['view_organization', 'Can view organization']],
            },
        ),
        migrations.CreateModel(
            name='Section',
            fields=[
                ('id', kobra.db_fields.IdField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', kobra.db_fields.NameField(max_length=64, verbose_name='name')),
                ('code', kobra.db_fields.NameField(help_text='Used to keep a reference to the values returned from Sesam. Never change this unless you know exactly what the consequences are.', max_length=64, unique=True, verbose_name='code')),
            ],
            options={
                'ordering': ['name'],
                'permissions': [['view_section', 'Can view section']],
            },
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', kobra.db_fields.IdField(default=None, editable=False, help_text="This ID is the same as the student's norEduPersonLIN. It will never change and thus can be used to integrate with other systems also utilizing the norEduPersonLIN.", primary_key=True, serialize=False, verbose_name='ID')),
                ('name', kobra.db_fields.NameField(max_length=128, verbose_name='name')),
                ('liu_id', models.CharField(max_length=8, unique=True, verbose_name='LiU ID')),
                ('liu_lin', models.UUIDField(verbose_name='LiU UID (LiULIN)')),
                ('mifare_id', models.BigIntegerField(blank=True, help_text='This field *must not* be used for anything else than caching. It is never guaranteed to be up-to-date and must not be disclosed publicly.', null=True, unique=True, verbose_name='Mifare ID')),
                ('last_updated', models.DateTimeField(auto_now=True, verbose_name='last updated')),
                ('section', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='members', to='kobra.Section')),
            ],
            options={
                'verbose_name': 'person',
                'verbose_name_plural': 'people',
            },
        ),
        migrations.CreateModel(
            name='TicketType',
            fields=[
                ('id', kobra.db_fields.IdField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', kobra.db_fields.NameField(max_length=64, verbose_name='name')),
                ('personal_discount_limit', models.PositiveIntegerField(blank=True, default=1, help_text='The maximum number of discount registrations per person for this ticket type. This should almost always be 1. Blank means no limit. Setting this incorrectly can make your organization liable for repayment.', null=True, verbose_name='personal discount limit')),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ticket_types', to='kobra.Event', verbose_name='event')),
            ],
            options={
                'permissions': [['view_tickettype', 'Can view ticket type']],
            },
        ),
        migrations.CreateModel(
            name='Union',
            fields=[
                ('id', kobra.db_fields.IdField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', kobra.db_fields.NameField(max_length=64, unique=True, verbose_name='name')),
            ],
        ),
        migrations.AddField(
            model_name='student',
            name='union',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='members', to='kobra.Union'),
        ),
        migrations.AddField(
            model_name='event',
            name='organization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='kobra.Organization'),
        ),
        migrations.AddField(
            model_name='discountregistration',
            name='student',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='discount_registrations', to='kobra.Student'),
        ),
        migrations.AddField(
            model_name='discount',
            name='ticket_type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='discounts', to='kobra.TicketType'),
        ),
        migrations.AddField(
            model_name='discount',
            name='union',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='discounts', to='kobra.Union'),
        ),
        migrations.AlterUniqueTogether(
            name='tickettype',
            unique_together=set([('event', 'name')]),
        ),
        migrations.AlterUniqueTogether(
            name='discount',
            unique_together=set([('ticket_type', 'union')]),
        ),
    ]
