# -*- coding: utf-8 -*-
from django.utils.translation import ugettext_lazy as _

from rest_framework import status
from rest_framework.exceptions import APIException


class KobraException(APIException):
    pass


class ProtectedFromDeletion(KobraException):
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = _('The resource is protected from deletion.')
