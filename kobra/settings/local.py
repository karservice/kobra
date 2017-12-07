# -*- coding: utf-8 -*-
from . import *

SECRET_KEY = env.str('KOBRA_SECRET_KEY',
                     'Unsafe_development_key._Never_use_in_production.')
DEBUG = env.bool('KOBRA_DEBUG_MODE', True)


DATABASES = {
    'default': env.db_url('KOBRA_DATABASE_URL', 'sqlite:///db.sqlite3')
}


REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = [
    'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    'rest_framework.authentication.TokenAuthentication',
    'rest_framework.authentication.SessionAuthentication',
]
