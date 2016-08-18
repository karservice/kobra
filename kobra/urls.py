# -*- coding: utf-8 -*-
from django.conf.urls import include, url
from django.contrib import admin

from .views import web_client_view


urlpatterns = [
    # url(r'^', include('kobra.api.v1.urls', namespace='legacy')),
    url(r'^api/v1/', include('kobra.api.v1.urls', namespace='v1')),

    url(r'^admin/', include(admin.site.urls)),

    # Matches everything and therefore must come last.
    url(r'^', include([
        url(r'^$', web_client_view, name='home'),
        url(r'^.*/$', web_client_view)
    ], namespace='web-client'))
]
