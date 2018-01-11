# -*- coding: utf-8 -*-
from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.contrib.auth.models import Group
from django.utils.translation import ugettext_lazy as _
from rest_framework.authtoken.admin import TokenAdmin
from rest_framework.authtoken.models import Token
from social_django.models import Association, Nonce

from . import models
from .forms import (
    AlwaysChangedModelForm,
    UserCreationForm,
    ticket_type_form_factory,
)


class DiscountRegistrationAdmin(admin.ModelAdmin):
    list_display = ['student', 'discount', 'timestamp']
    list_filter = ['discount__ticket_type', 'discount__union']
    ordering = ['-timestamp']


class TicketTypeInline(admin.TabularInline):
    model = models.TicketType
    form = ticket_type_form_factory()
    extra = 0
    min_num = 1


class EventAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization']
    list_filter = ['organization']
    search_fields = ['name', 'organization__name', 'ticket_types__name']

    inlines = [TicketTypeInline]


class OrganizationAdmin(admin.ModelAdmin):
    filter_horizontal = ['admins']


class UserTokenInline(admin.TabularInline):
    model = Token
    form = AlwaysChangedModelForm
    extra = 0
    max_num = 1
    verbose_name = _('API token')
    verbose_name_plural = _('API tokens')
    fields = ['key', 'created']
    readonly_fields = ['key', 'created']


class UserAdmin(DjangoUserAdmin):
    fieldsets = [
        (None, {
            'fields': [
                'name',
                'email',
                'password',
            ],
        }),
        (_('Permissions'), {
            'classes': ['collapse'],
            'fields': [
                'is_active',
                'is_staff',
                'is_superuser',
            ],
        }),
    ]
    add_fieldsets = [
        (None, {
            'classes': ['wide'],
            'fields': [
                'name',
                'email',
            ],
        }),
    ]

    list_display = ['email', 'name', 'is_staff']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'groups']
    ordering = ['email']
    search_fields = ['email', 'name']

    add_form = UserCreationForm
    inlines = [UserTokenInline]

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return []
        return super().get_inline_instances(request, obj)


admin.site.register(models.DiscountRegistration, DiscountRegistrationAdmin)
admin.site.register(models.Event, EventAdmin)
admin.site.register(models.Organization, OrganizationAdmin)
admin.site.register(models.User, UserAdmin)
admin.site.unregister(Association)
admin.site.unregister(Group)
admin.site.unregister(Nonce)
admin.site.unregister(Token)
