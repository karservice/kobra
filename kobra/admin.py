# -*- coding: utf-8 -*-
from django.contrib import admin

from .models import (Discount, DiscountRegistration, Event, Organization,
                     Student, Section, Union, TicketType)


class DiscountAdmin(admin.ModelAdmin):
    pass


class DiscountUtilizationAdmin(admin.ModelAdmin):
    pass


class EventAdmin(admin.ModelAdmin):
    pass


class OrganizationAdmin(admin.ModelAdmin):
    pass


class PersonAdmin(admin.ModelAdmin):
    pass


class SectionAdmin(admin.ModelAdmin):
    pass


class TicketTypeAdmin(admin.ModelAdmin):
    pass


admin.site.register(Discount, DiscountAdmin)
admin.site.register(DiscountRegistration, DiscountUtilizationAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Organization, OrganizationAdmin)
admin.site.register(Student, PersonAdmin)
admin.site.register(Section, SectionAdmin)
admin.site.register(TicketType, TicketTypeAdmin)
