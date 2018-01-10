# -*- coding: utf-8 -*-
from . import *

SECRET_KEY = env.str('KOBRA_SECRET_KEY')
DEBUG = env.bool('KOBRA_DEBUG_MODE', False)

DATABASES = {
    'default': env.db_url('KOBRA_DATABASE_URL')
}

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
