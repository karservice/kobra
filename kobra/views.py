# -*- coding: utf-8 -*-
import json

from django.conf import settings
from django.http.response import HttpResponse
from django.template.response import TemplateResponse


def health_view(request):
    return HttpResponse()


def frontend_view(request):
    return TemplateResponse(request, template='index.html', context=dict(
        FRONTEND_ENV=json.dumps(settings.FRONTEND_SETTINGS),
    ))
