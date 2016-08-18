# -*- coding: utf-8 -*-
from django.conf import settings
from django.shortcuts import render_to_response

from rest_framework.reverse import reverse


def web_client_view(request):
    context = {
        'api_root': reverse('v1:api-root', request=request),
        'opbeat_frontend_organization_id': settings.OPBEAT_FRONTEND['ORGANIZATION_ID'],
        'opbeat_frontend_app_id': settings.OPBEAT_FRONTEND['APP_ID']
    }

    return render_to_response('index.html', context=context)
