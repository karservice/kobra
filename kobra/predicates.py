# -*- coding: utf-8 -*-
import rules

from . import models


# Model level (i.e. with obj=None) permission requests are used for list
# requests in the API, so we want to allow those in a convenient manner.
@rules.predicate
def is_model_level(user, obj):
    if obj is None:
        return True
    return False


@rules.predicate
def is_any_organization_admin(user):
    return models.Organization.objects.filter(admins__in=[user]).exists()


@rules.predicate
def is_organization_admin(user, organization):
    if organization is None:
        return False
    return organization.admins.filter(pk=user.pk).exists()


@rules.predicate
def is_event_admin(user, event):
    if event is None:
        return False
    return is_organization_admin(user, event.organization)


@rules.predicate
def is_ticket_type_admin(user, ticket_type):
    if ticket_type is None:
        return False
    return is_event_admin(user, ticket_type.event)


@rules.predicate
def is_discount_admin(user, discount):
    if discount is None:
        return False
    return is_ticket_type_admin(user, discount.ticket_type)


@rules.predicate
def is_discount_registration_admin(user, discount_registration):
    if discount_registration is None:
        return False
    return is_discount_admin(user, discount_registration.discount)
