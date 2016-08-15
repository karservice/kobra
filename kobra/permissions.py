# -*- coding: utf-8 -*-
import rules

from . import predicates


defaults = rules.is_authenticated & (
    predicates.always_allow_model_perm | rules.is_superuser)

rules.add_perm('kobra.add_discount', defaults)
rules.add_perm('kobra.view_discount',
               (defaults | predicates.is_discount_admin))
rules.add_perm('kobra.change_discount',
               (defaults | predicates.is_discount_admin))
rules.add_perm('kobra.delete_discount',
               (defaults | predicates.is_discount_admin))

rules.add_perm('kobra.add_discountregistration', defaults)
rules.add_perm('kobra.view_discountregistration',
               (defaults | predicates.is_discount_registration_admin))
rules.add_perm('kobra.change_discountregistration',
               (defaults | predicates.is_discount_registration_admin))

rules.add_perm('kobra.add_event', defaults)
rules.add_perm('kobra.view_event', (defaults | predicates.is_event_admin))
rules.add_perm('kobra.change_event', (defaults | predicates.is_event_admin))
rules.add_perm('kobra.delete_event', (defaults | predicates.is_event_admin))

# rules.add_perm('kobra.add_organization', defaults)
rules.add_perm('kobra.view_organization',
               (defaults | predicates.is_organization_admin))
rules.add_perm('kobra.change_organization',
               (defaults | predicates.is_organization_admin))
# rules.add_perm('kobra.delete_organization', defaults)

rules.add_perm('kobra.view_section', rules.is_authenticated)

rules.add_perm('kobra.view_student', rules.is_authenticated)

rules.add_perm('kobra.add_tickettype', defaults)
rules.add_perm('kobra.view_tickettype',
               (defaults | predicates.is_ticket_type_admin))
rules.add_perm('kobra.change_tickettype',
               (defaults | predicates.is_ticket_type_admin))
rules.add_perm('kobra.delete_tickettype',
               (defaults | predicates.is_ticket_type_admin))

rules.add_perm('kobra.view_union', rules.is_authenticated)
