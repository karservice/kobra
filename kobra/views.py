# -*- coding: utf-8 -*-
from django.views.generic import TemplateView


class WebApplicationView(TemplateView):
    template_name = 'base.html'
