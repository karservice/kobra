# -*- coding: utf-8 -*-
from django.contrib import admin

from . import models


class DiscountRegistrationAdmin(admin.ModelAdmin):
    list_display = ['student', 'discount', 'timestamp']
    list_filter = ['discount__ticket_type', 'discount__union']
    ordering = ['-timestamp']


class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization']


class OrganizationAdmin(admin.ModelAdmin):
    pass


class SectionAdmin(admin.ModelAdmin):
    pass


class DiscountInline(admin.TabularInline):
    model = models.Discount
    extra = 3
    max_num = 3


class TicketTypeAdmin(admin.ModelAdmin):
    inlines = [DiscountInline]


admin.site.register(models.DiscountRegistration, DiscountRegistrationAdmin)
admin.site.register(models.Event, EventAdmin)
admin.site.register(models.Organization, OrganizationAdmin)
admin.site.register(models.Section, SectionAdmin)
admin.site.register(models.TicketType, TicketTypeAdmin)
