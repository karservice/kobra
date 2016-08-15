# -*- coding: utf-8 -*-
from django.apps import AppConfig


class KobraConfig(AppConfig):
    name = 'kobra'
    verbose_name = 'Kobra'

    def ready(self):
        # Imports the permissions module to make sure the rules are loaded
        from . import permissions


default_app_config = 'kobra.KobraConfig'
