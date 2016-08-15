# -*- coding: utf-8 -*-
import rules


@rules.predicate
def always_allow_model_perm(user, obj):
    if obj is None:
        return True
    return False


@rules.predicate
def is_organization_admin(user, organization):
    return organization.admins.filter(pk=user.pk).exists()


@rules.predicate
def is_event_admin(user, event):
    return is_organization_admin(user, event.organization)


@rules.predicate
def is_ticket_type_admin(user, ticket_type):
    return is_event_admin(user, ticket_type.event)


@rules.predicate
def is_discount_admin(user, discount):
    return is_ticket_type_admin(user, discount.ticket_type)


@rules.predicate
def is_discount_registration_admin(user, discount_registration):
    return is_discount_admin(user, discount_registration.discount)
