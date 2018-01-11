# -*- coding: utf-8 -*-
import django_filters
from django_filters.rest_framework import DjangoFilterBackend, FilterSet
from rest_framework import filters

from ...models import DiscountRegistration, Event, TicketType


class DiscountPermissionFilter(DjangoFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(
            ticket_type__event__organization__admins=request.user)


class DiscountRegistrationFilter(FilterSet):
    event = django_filters.ModelChoiceFilter(
        name='discount__ticket_type__event',
        queryset=Event.objects.all())

    class Meta:
        model = DiscountRegistration
        fields = [
            'event',
            'student'
        ]


class DiscountRegistrationPermissionFilter(DjangoFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(
            discount__ticket_type__event__organization__admins=request.user)


class EventPermissionFilter(DjangoFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(organization__admins=request.user)


class OrganizationPermissionFilter(DjangoFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(admins=request.user)


class TicketTypePermissionFilter(DjangoFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(event__organization__admins=request.user)
