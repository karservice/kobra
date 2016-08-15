# -*- coding: utf-8 -*-
from ._common import *

SECRET_KEY = env.str('DJANGO_SECRET_KEY')
DEBUG = env.bool('DJANGO_DEBUG_MODE', False)

DATABASES = {
    'default': env.db_url('DJANGO_DATABASE_URL')
}

REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = [
    'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    'rest_framework.authentication.TokenAuthentication',
]

REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = [
    'rest_framework.renderers.JSONRenderer'
]

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
