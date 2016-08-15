# -*- coding: utf-8 -*-
import uuid

from django.conf import settings

import factory, factory.fuzzy

from .models import (Discount, DiscountRegistration, Event, Organization,
                     Section, Student, TicketType, Union)


class OrganizationFactory(factory.DjangoModelFactory):
    name = factory.Faker('company')

    class Meta:
        model = Organization


class EventFactory(factory.DjangoModelFactory):
    name = factory.Faker('word')
    organization = factory.SubFactory(OrganizationFactory)

    class Meta:
        model = Event


class TicketTypeFactory(factory.DjangoModelFactory):
    name = factory.Faker('word')
    event = factory.SubFactory(EventFactory)

    class Meta:
        model = TicketType


class DiscountFactory(factory.DjangoModelFactory):
    ticket_type = factory.SubFactory(TicketTypeFactory)
    union = factory.Iterator(Union.objects.all())
    amount = factory.fuzzy.FuzzyInteger(5, 30)

    class Meta:
        model = Discount


class UnionFactory(factory.DjangoModelFactory):
    name = factory.Faker('company')

    class Meta:
        model = Union


class SectionFactory(factory.DjangoModelFactory):
    name = factory.Faker('company')
    code = factory.LazyAttribute(lambda self: self.name[:3])

    class Meta:
        model = Section


class StudentFactory(factory.DjangoModelFactory):
    name = factory.Faker('name')
    liu_id = factory.LazyAttributeSequence(
        lambda self, seq: '{:.5}{:03d}'.format(
            self.name.lower(), seq))
    mifare_id = factory.fuzzy.FuzzyInteger(0, 0xffffffffffffff)

    union = factory.SubFactory(UnionFactory)
    section = factory.SubFactory(SectionFactory)

    email = factory.Faker('email')

    id = factory.LazyFunction(uuid.uuid4)
    liu_lin = factory.LazyFunction(uuid.uuid4)

    class Meta:
        model = Student


class DiscountRegistrationFactory(factory.DjangoModelFactory):
    discount = factory.SubFactory(DiscountFactory)
    student = factory.SubFactory(StudentFactory)

    class Meta:
        model = DiscountRegistration


class UserFactory(factory.DjangoModelFactory):
    name = factory.Faker('name')

    email = factory.Faker('email')

    class Meta:
        model = settings.AUTH_USER_MODEL
