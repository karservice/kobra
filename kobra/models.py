# -*- coding: utf-8 -*-
import logging

from django.conf import settings
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        PermissionsMixin)
from django.db import models
from django.utils.timezone import now
from django.utils.translation import ugettext_lazy as _

from sesam import SesamError, SesamStudentNotFound, SesamStudentServiceClient
from .db_fields import IdField, MoneyField, NameField


logger = logging.getLogger(__name__)

sesam_student_service_client = SesamStudentServiceClient(
    settings.SESAM_USERNAME, settings.SESAM_PASSWORD)


def update_or_create_from_sesam(student=None, **kwargs):
    sesam_student = sesam_student_service_client.get_student(
        iso_id=kwargs.pop('iso_id', None),
        liu_id=kwargs.pop('liu_id', None),
        mifare_id=kwargs.pop('mifare_id', None),
        nor_edu_person_lin=kwargs.pop('id', None),
        nor_edu_person_nin=kwargs.pop('national_id', None)
    )

    if kwargs:
        raise TypeError("Can't search Sesam for the specified parameter(s)")

    if not student:
        student_kwargs = dict(id=sesam_student.nor_edu_person_lin)
        try:
            student = Student.objects.get(**student_kwargs)
        except Student.DoesNotExist:
            # Just instantiate, don't save.
            student = Student(**student_kwargs)

    student.email = sesam_student.email
    student.liu_id = sesam_student.liu_id
    student.liu_lin = sesam_student.liu_lin
    student.full_name = sesam_student.full_name
    student.first_name = sesam_student.first_name
    student.last_name = sesam_student.last_name
    student.union = Union.objects.get_or_create(
        name=sesam_student.main_union)[0] if sesam_student.main_union else None
    # The student_union field in Sesam is not a good indicator of section
    # membership and is therefore deprecated.
    student.section = None

    return student


class Discount(models.Model):
    id = IdField()

    ticket_type = models.ForeignKey(
        'TicketType',
        related_name='discounts')
    union = models.ForeignKey(
        'Union',
        related_name='discounts')
    amount = MoneyField()

    class Meta:
        unique_together = [['ticket_type', 'union']]

        permissions = [
            ['view_discount', _('Can view discount')]
        ]

    def __str__(self):
        return '{} - {}: {} kr'.format(self.ticket_type, self.union,
                                       self.amount)


class DiscountRegistration(models.Model):
    id = IdField()

    discount = models.ForeignKey(
        'Discount',
        related_name='discount_registrations',
        on_delete=models.PROTECT)
    student = models.ForeignKey(
        'Student',
        related_name='discount_registrations',
        on_delete=models.PROTECT)

    timestamp = models.DateTimeField(
        default=now)

    class Meta:
        ordering = ['-timestamp']

        permissions = [
            ['view_discountregistration', _('Can view discount registration')]
        ]


class Event(models.Model):
    id = IdField()

    name = NameField()

    organization = models.ForeignKey(
        'Organization',
        related_name='events')

    class Meta:
        ordering = ['name']

        permissions = [
            ['view_event', _('Can view event')]
        ]

    def __str__(self):
        return '{} / {}'.format(self.organization, self.name)


class Organization(models.Model):
    id = IdField()

    name = NameField(
        unique=True)

    admins = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        blank=True,
        related_name='organizations_administered')

    class Meta:
        ordering = ['name']

        permissions = [
            ['view_organization', _('Can view organization')]
        ]

    def __str__(self):
        return self.name


class Section(models.Model):
    id = IdField()

    name = NameField()
    code = NameField(
        unique=True,
        verbose_name=_('code'),
        help_text=_('Used to keep a reference to the values returned from '
                    'Sesam. Never change this unless you know exactly what the '
                    'consequences are.'))

    class Meta:
        ordering = ['name']

        permissions = [
            ['view_section', _('Can view section')]
        ]

    def __str__(self):
        return self.name


class StudentQuerySet(models.QuerySet):
    def get_with_sesam(self, *args, **kwargs):
        # Specifies if the student model has changed during the get procedure.
        # Used so that we only save the model once, if needed.
        student_changed = False

        try:
            student = self.get(*args, **kwargs)
            # Only update from SESAM if the data is old.
            if student.is_outdated:
                try:
                    student.update_from_sesam()
                    student_changed = True
                except SesamError:
                    # This is an unwanted state that most likely means that we
                    # encountered some error in Sesam. So we just log this and
                    # ignore that the data may be outdated, to avoid downtime we
                    # cannot control.
                    logger.error('Encountered an error in Sesam.',
                                 exc_info=True)

        except self.model.DoesNotExist as exc:
            try:
                student = update_or_create_from_sesam(**kwargs)
                student_changed = True
            except SesamStudentNotFound:
                raise exc

        if 'mifare_id' in kwargs and (
                student.mifare_id != int(kwargs['mifare_id'])):
            student.mifare_id = kwargs['mifare_id']
            student_changed = True

        if student_changed:
            student.save()

        return student

    def get(self, *args, use_sesam=False, **kwargs):
        # use_sesam is False by default since the get() method is used
        # extensively by Django internals.

        if hasattr(kwargs, 'liu_id'):
            # Always coerce LiU ID to lowercase
            kwargs['liu_id'] = kwargs['liu_id'].lower()

        if use_sesam:
            return self.get_with_sesam(*args, **kwargs)

        return super(StudentQuerySet, self).get(*args, **kwargs)


class Student(models.Model):
    id = IdField(default=None,  # Only accept explicitly set IDs
                 help_text=_("This ID is the same as the student's "
                             "norEduPersonLIN. It will never change and thus "
                             "can be used to integrate with other systems also "
                             "utilizing the norEduPersonLIN."))

    full_name = NameField(
        max_length=128,
        verbose_name=_('full name'))
    first_name = NameField(
        verbose_name=_('first name'))
    last_name = NameField(
        verbose_name=_('last name'))

    email = models.EmailField(
        verbose_name=_('email address'))
    liu_id = models.CharField(
        max_length=8,
        verbose_name=_('LiU ID'))
    liu_lin = models.UUIDField(
        verbose_name=_('LiU LIN'))

    # Mifare cards can have 7 byte UIDs, so we need the 8 bytes available in a
    # bigint
    mifare_id = models.BigIntegerField(
        null=True,
        blank=True,
        verbose_name=_('Mifare ID'),
        help_text=_('This field *must not* be used for anything else than '
                    'caching. It is never guaranteed to be up-to-date and must '
                    'not be disclosed publicly.'))

    union = models.ForeignKey(
        'Union',
        related_name='members',
        null=True,
        blank=True)
    section = models.ForeignKey(
        'Section',
        related_name='members',
        null=True,
        blank=True)

    last_updated = models.DateTimeField(
        auto_now=True,
        verbose_name=_('last updated'))

    objects = StudentQuerySet.as_manager()

    class Meta:
        ordering = ['liu_id']

        verbose_name = _('student')
        verbose_name_plural = _('students')

    def __str__(self):
        return self.liu_id

    @property
    def time_since_last_update(self):
        return now() - self.last_updated

    @property
    def is_outdated(self):
        return self.time_since_last_update >= settings.SESAM_DATA_AGE_THRESHOLD

    def update_from_sesam(self):
        update_or_create_from_sesam(student=self, id=self.id)


class TicketType(models.Model):
    id = IdField()

    name = NameField()
    event = models.ForeignKey(
        'Event',
        related_name='ticket_types',
        verbose_name=_('event'))

    personal_discount_limit = models.PositiveIntegerField(
        default=1,
        null=True,
        blank=True,
        verbose_name=_('personal discount limit'),
        help_text=_('The maximum number of discount registrations per person '
                    'for this ticket type. This should almost always be 1. '
                    'Blank means no limit. Setting this incorrectly can make '
                    'your organization liable for repayment.'))

    class Meta:
        ordering = ['name']

        permissions = [
            ['view_tickettype', _('Can view ticket type')]
        ]

        unique_together = [['event', 'name']]

    def __str__(self):
        return '{} / {}'.format(self.event, self.name)


class Union(models.Model):
    id = IdField()

    name = NameField(
        unique=True)

    def __str__(self):
        return self.name


class UserManager(BaseUserManager):
    def create_user(self, email, name=None, fullname=None, password=None):
        if fullname:
            # This is kind of a hack to adapt to python-social-auth.
            name = fullname

        if not email:
            raise ValueError(_('User must have an email address.'))

        user = self.model(
            name=name,
            email=self.normalize_email(email)
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(
            email=email,
            name=name,
            password=password
        )

        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin, models.Model):
    id = IdField()

    name = NameField(
        verbose_name=_('name'),
        help_text=_('Complete name of the user. In the case of a person, this '
                    'means at least first and last names.'))
    email = models.EmailField(
        unique=True,
        verbose_name=_('email address'))

    is_active = models.BooleanField(
        default=True,
        verbose_name=_('active'),
        help_text=_('Designates whether this user should be treated as active. '
                    'Unselect this instead of deleting accounts.'))
    is_staff = models.BooleanField(
        default=False,
        verbose_name=_('staff status'),
        help_text=_('Designates whether the user can log into this admin '
                    'site.'))

    date_created = models.DateTimeField(
        auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        ordering = ['email']

        permissions = [
            ['view_user', _('Can view user')]
        ]

    def __str__(self):
        return '{} ({})'.format(self.email, self.name)

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.get_full_name()
