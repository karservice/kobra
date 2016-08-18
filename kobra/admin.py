# -*- coding: utf-8 -*-
from django.contrib import admin

from . import models


class DiscountAdmin(admin.ModelAdmin):
    pass


class DiscountRegistrationAdmin(admin.ModelAdmin):
    pass


class EventAdmin(admin.ModelAdmin):
    pass


class OrganizationAdmin(admin.ModelAdmin):
    pass


class SectionAdmin(admin.ModelAdmin):
    pass


class DiscountInline(admin.TabularInline):
    model = models.Discount


class TicketTypeAdmin(admin.ModelAdmin):
    inlines = [DiscountInline]


admin.site.register(models.Discount, DiscountAdmin)
admin.site.register(models.DiscountRegistration, DiscountRegistrationAdmin)
admin.site.register(models.Event, EventAdmin)
admin.site.register(models.Organization, OrganizationAdmin)
admin.site.register(models.Section, SectionAdmin)
admin.site.register(models.TicketType, TicketTypeAdmin)
