# -*- coding: utf-8 -*-
from django.contrib import admin

from . import models


class DiscountRegistrationAdmin(admin.ModelAdmin):
    list_display = ['student', 'discount', 'timestamp']
    list_filter = ['discount__ticket_type', 'discount__union']
    ordering = ['-timestamp']


class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization']


class EventInline(admin.TabularInline):
    model = models.Event
    extra = 1


class OrganizationAdmin(admin.ModelAdmin):
    filter_horizontal = ['admins']

    inlines = [EventInline]


class DiscountInline(admin.TabularInline):
    model = models.Discount
    extra = 3
    max_num = 3


class TicketTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'event']
    inlines = [DiscountInline]


admin.site.register(models.DiscountRegistration, DiscountRegistrationAdmin)
admin.site.register(models.Event, EventAdmin)
admin.site.register(models.Organization, OrganizationAdmin)
admin.site.register(models.TicketType, TicketTypeAdmin)
