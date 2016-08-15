# -*- coding: utf-8 -*-
from django.conf.urls import include, url
from django.contrib import admin

from .views import WebApplicationView

urlpatterns = [
    # url(r'^', include('kobra.api.v1.urls', namespace='legacy')),
    url(r'^api/v1/', include('kobra.api.v1.urls', namespace='v1')),

    url(r'^admin/', include(admin.site.urls)),
    # url(r'^', WebApplicationView.as_view())
]
