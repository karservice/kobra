# -*- coding: utf-8 -*-
import django_filters
from rest_framework import filters

from ...models import DiscountRegistration, Event, TicketType


class DiscountPermissionFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(
            ticket_type__event__organization__admins=request.user)


class DiscountRegistrationFilter(filters.FilterSet):
    event = django_filters.ModelChoiceFilter(
        name='discount__ticket_type__event',
        queryset=Event.objects.all())
    ticket_type = django_filters.ModelChoiceFilter(
        name='discount__ticket_type',
        queryset=TicketType.objects.all())

    class Meta:
        model = DiscountRegistration
        fields = [
            'event',
            'ticket_type',
            'student'
        ]


class DiscountRegistrationPermissionFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(
            discount__ticket_type__event__organization__admins=request.user)


class EventPermissionFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(organization__admins=request.user)


class OrganizationPermissionFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(admins=request.user)


class TicketTypePermissionFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(event__organization__admins=request.user)


class UserPermissionFilter(filters.BaseFilterBackend):
    def filter_queryset(self, request, queryset, view):
        return queryset.filter(pk=request.user.pk)
