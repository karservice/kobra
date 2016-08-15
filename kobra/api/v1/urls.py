# -*- coding: utf-8 -*-
from django.conf.urls import url, include

from rest_framework import routers
from rest_framework_jwt.views import (obtain_jwt_token, refresh_jwt_token,
                                      verify_jwt_token)

from . import views


class Router(routers.DefaultRouter):
    include_format_suffixes = False


router = Router()
router.register(r'discounts', views.DiscountViewSet)
router.register(r'discount-registrations', views.DiscountRegistrationViewSet)
router.register(r'events', views.EventViewSet)
router.register(r'organizations', views.OrganizationViewSet)
router.register(r'students', views.StudentByLiuIdViewSet)
router.register(r'students', views.StudentByMifareIdViewSet)
# This is matched by wildcard: keep it last.
router.register(r'students', views.StudentViewSet)
router.register(r'sections', views.SectionViewSet)
router.register(r'ticket-types', views.TicketTypeViewSet)
router.register(r'unions', views.UnionViewSet)
router.register(r'users', views.UserViewSet)

urlpatterns = [
    url(r'^', include(router.urls)),

    url(r'^auth/jwt/$', obtain_jwt_token),
    url(r'^auth/jwt/refresh/$', refresh_jwt_token),
    url(r'^auth/jwt/verify/$', verify_jwt_token)
]
