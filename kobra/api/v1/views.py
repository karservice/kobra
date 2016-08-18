# -*- coding: utf-8 -*-
from django.db.models import ProtectedError
from django.utils.translation import ugettext_lazy as _

import rest_framework.filters
from rest_framework import mixins, viewsets, exceptions
from rest_framework.generics import get_object_or_404
from rest_framework.mixins import RetrieveModelMixin

from ... import models
from . import serializers, filters
from .exceptions import ProtectedFromDeletion


class NoUpdateModelViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin,
                           mixins.CreateModelMixin, mixins.DestroyModelMixin,
                           viewsets.GenericViewSet):
    pass


class RegistrationsDeleteProtectedMixin(object):
    def perform_destroy(self, instance):
        try:
            super(RegistrationsDeleteProtectedMixin, self).perform_destroy(
                instance)
        except ProtectedError:
            raise ProtectedFromDeletion(_('This resource has associated '
                                          'registrations and therefore cannot '
                                          'be deleted.'))


class DiscountViewSet(RegistrationsDeleteProtectedMixin, viewsets.ModelViewSet):
    queryset = models.Discount.objects.all()
    serializer_class = serializers.DiscountSerializer
    filter_backends = [filters.DiscountPermissionFilter]


class DiscountRegistrationViewSet(NoUpdateModelViewSet):
    queryset = models.DiscountRegistration.objects.all()
    serializer_class = serializers.DiscountRegistrationSerializer
    filter_backends = [filters.DiscountRegistrationPermissionFilter,
                       rest_framework.filters.DjangoFilterBackend]
    filter_class = filters.DiscountRegistrationFilter


class EventViewSet(RegistrationsDeleteProtectedMixin, viewsets.ModelViewSet):
    queryset = models.Event.objects.all()
    serializer_class = serializers.EventSerializer
    filter_backends = [filters.EventPermissionFilter]


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = models.Organization.objects.all()
    serializer_class = serializers.OrganizationSerializer
    filter_backends = [filters.OrganizationPermissionFilter]


class StudentViewSet(RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = models.Student.objects.all()
    serializer_class = serializers.StudentSerializer

    def get_object(self):
        # From rest_framework.generics.GenericAPIView.get_object with the
        # addition of the use_sesam argument passed on to Person.get() method
        queryset = self.filter_queryset(self.get_queryset())
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        obj = get_object_or_404(queryset, use_sesam=True,
                                **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj


class StudentByLiuIdViewSet(StudentViewSet):
    lookup_field = 'liu_id'
    # No person in database as of 2016-07-05 with just two letters in LiU ID,
    # but you never know...
    lookup_value_regex = '[a-z]{2,5}[0-9]{2,3}'


class StudentByMifareIdViewSet(StudentViewSet):
    lookup_field = 'mifare_id'
    # The Mifare cards used by LiU have 4 or 7 bytes UIDs. The maximum number is
    # therefore 72057594037927940, giving 17 characters.
    lookup_value_regex = '\d{1,17}'


class SectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Section.objects.all()
    serializer_class = serializers.SectionSerializer


class TicketTypeViewSet(viewsets.ModelViewSet):
    queryset = models.TicketType.objects.all()
    serializer_class = serializers.TicketTypeSerializer
    filter_backends = [filters.TicketTypePermissionFilter]


class UnionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = models.Union.objects.all()
    serializer_class = serializers.UnionSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer
