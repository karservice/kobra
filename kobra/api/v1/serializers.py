# -*- coding: utf-8 -*-
from collections import OrderedDict
from itertools import groupby

from django.db.models import Count
from django.db.models.functions import Trunc
from django.utils.translation import ugettext_lazy as _
from rest_social_auth.serializers import JWTSerializer
from rest_framework_expandable import ExpandableSerializerMixin

from rest_framework import serializers
from rest_framework.reverse import reverse

from ... import predicates
from ...models import (Discount, DiscountRegistration, Event, Organization,
                       Student, Section, Union, User, TicketType)


class DiscountSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Discount
        fields = [
            'url',
            'id',
            'ticket_type',
            'union',
            'amount'
        ]

    def validate_ticket_type(self, value):
        user = self.context['request'].user
        if not predicates.is_ticket_type_admin(user, value):
            # fixme: this is actually leaking information, although not critical
            # Ideally, this should behave identically as if the ticket type does
            # not exist.
            raise serializers.ValidationError(_(_("Unauthorized to use "
                                                  "specified ticket type")))
        return value


class DiscountRegistrationSummaryListSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        # data is a QuerySet of DiscountRegistration objects
        grouped_data = groupby(
            data.order_by()
                .annotate(timespan=Trunc('timestamp', self.context['request'].query_params.get('resolution', 'hour')))
                .values('timespan', 'discount_id')
                .annotate(count=Count('id'))
                .order_by('timespan'),
            lambda x: x['timespan']
        )

        groups = (
            dict(timespan=timespan, discount_registrations=points)
            for timespan, points in grouped_data
        )

        return super(DiscountRegistrationSummaryListSerializer, self).to_representation(data=groups)


class DiscountRegistrationSummaryPointSerializer(serializers.Serializer):
    discount = serializers.SerializerMethodField()
    count = serializers.IntegerField()

    def get_discount(self, obj):
        return reverse('v1:discount-detail', kwargs={'pk': str(obj['discount_id'])}, request=self.context['request'])


class DiscountRegistrationSummarySerializer(serializers.Serializer):
    timespan = serializers.DateTimeField()
    discount_registrations = DiscountRegistrationSummaryPointSerializer(many=True)

    class Meta:
        list_serializer_class = DiscountRegistrationSummaryListSerializer


class DiscountRegistrationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = DiscountRegistration
        fields = [
            'url',
            'id',
            'discount',
            'student',
            'timestamp'
        ]

    def validate_discount(self, value):
        user = self.context['request'].user
        if not predicates.is_discount_admin(user, value):
            # fixme: this is actually leaking information, although not critical
            # Ideally, this should behave identically as if the discount does
            # not exist.
            raise serializers.ValidationError(_("Unauthorized to use specified "
                                                "discount"))
        return value

    def validate(self, attrs):
        discount = attrs['discount']
        student = attrs['student']

        # Checks number of registration for this discount/student against
        # maximum number of discounts per person for the discount's ticket type
        if (discount.discount_registrations.filter(student=student).count()
                >= discount.ticket_type.personal_discount_limit):
            raise serializers.ValidationError(
                {'student': _('This student has reached the maximum number of '
                              'registrations for this discount.')})

        if not discount.union == student.union:
            raise serializers.ValidationError(
                {'student': _('This student is not a member of {}.'.format(
                    discount.union))})
        return attrs


class EventSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Event
        fields = [
            'url',
            'id',
            'name',
            'organization'
        ]

    def validate_organization(self, value):
        user = self.context['request'].user
        if not predicates.is_organization_admin(user, value):
            # fixme: this is actually leaking information, although not critical
            # Ideally, this should behave identically as if the organization
            # does not exist.
            raise serializers.ValidationError(_("Unauthorized to use specified "
                                                "organization"))
        return value


class OrganizationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Organization
        fields = [
            'url',
            'id',
            'name'
        ]


class SectionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Section
        fields = [
            'url',
            'id',
            'name'
        ]


class StudentSerializer(ExpandableSerializerMixin,
                        serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Student
        fields = [
            'url',
            'id',
            'liu_id',
            'name',
            'union',
            'section',
            'liu_lin',
            'email',
            'last_updated'
        ]
        expandable_fields = {
            'union': ('.UnionSerializer', [], {}),
            'section': ('.SectionSerializer', [], {})
        }


class TicketTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = TicketType
        fields = [
            'url',
            'id',
            'name',
            'event',
            'personal_discount_limit'
        ]

    def validate_event(self, value):
        user = self.context['request'].user
        if not predicates.is_event_admin(user, value):
            # fixme: this is actually leaking information, although not critical
            # Ideally, this should behave identically as if the event
            # does not exist.
            raise serializers.ValidationError(_("Unauthorized to use specified "
                                                "event"))
        return value


class UnionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Union
        fields = [
            'url',
            'id',
            'name'
        ]


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = [
            'url',
            'id',
            'name',
            'email'
        ]


class UserTokenSerializer(JWTSerializer):
    user = serializers.HyperlinkedIdentityField('v1:user-detail')


def jwt_response_payload_handler(token, user=None, request=None):
    return OrderedDict(
        token=token,
        user=reverse('v1:user-detail', kwargs={'pk': user.pk}, request=request)
    )
