# -*- coding: utf-8 -*-
import rules

from . import predicates


is_authenticated_model_level = (rules.is_authenticated &
                                predicates.is_model_level)

rules.add_perm('kobra.add_discount', is_authenticated_model_level)
rules.add_perm('kobra.view_discount',
               (is_authenticated_model_level | predicates.is_discount_admin))
rules.add_perm('kobra.change_discount',
               (is_authenticated_model_level | predicates.is_discount_admin))
rules.add_perm('kobra.delete_discount',
               (is_authenticated_model_level | predicates.is_discount_admin))

rules.add_perm('kobra.add_discountregistration', is_authenticated_model_level)
rules.add_perm('kobra.view_discountregistration',
               (is_authenticated_model_level |
                predicates.is_discount_registration_admin))
rules.add_perm('kobra.change_discountregistration',
               (is_authenticated_model_level |
                predicates.is_discount_registration_admin))
rules.add_perm('kobra.delete_discountregistration',
               (is_authenticated_model_level |
                predicates.is_discount_registration_admin))

rules.add_perm('kobra.add_event', is_authenticated_model_level)
rules.add_perm('kobra.view_event', (is_authenticated_model_level |
                                    predicates.is_event_admin))
rules.add_perm('kobra.change_event', (is_authenticated_model_level |
                                      predicates.is_event_admin))
rules.add_perm('kobra.delete_event', (is_authenticated_model_level |
                                      predicates.is_event_admin))

rules.add_perm('kobra.view_organization',
               (is_authenticated_model_level |
                predicates.is_organization_admin))
rules.add_perm('kobra.change_organization',
               (is_authenticated_model_level |
                predicates.is_organization_admin))

rules.add_perm('kobra.view_section', rules.is_authenticated)

rules.add_perm('kobra.view_student', (rules.is_authenticated &
                                      predicates.is_any_organization_admin))

rules.add_perm('kobra.add_tickettype', is_authenticated_model_level)
rules.add_perm('kobra.view_tickettype',
               (is_authenticated_model_level | predicates.is_ticket_type_admin))
rules.add_perm('kobra.change_tickettype',
               (is_authenticated_model_level | predicates.is_ticket_type_admin))
rules.add_perm('kobra.delete_tickettype',
               (is_authenticated_model_level | predicates.is_ticket_type_admin))

rules.add_perm('kobra.view_union', rules.is_authenticated)

rules.add_perm('kobra.view_user',
               (is_authenticated_model_level | predicates.is_user_admin))
