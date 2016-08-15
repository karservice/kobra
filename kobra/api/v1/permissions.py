# -*- coding: utf-8 -*-
from rest_framework.permissions import DjangoObjectPermissions


class KobraObjectPermissions(DjangoObjectPermissions):
    """
    Implementing view permissions as described in
    http://www.django-rest-framework.org/api-guide/filtering/#djangoobjectpermissionsfilter
    """

    def __init__(self):
        self.perms_map['GET'] = \
            self.perms_map['OPTIONS'] = \
            self.perms_map['HEAD'] = ['%(app_label)s.view_%(model_name)s']
        super(KobraObjectPermissions, self).__init__()
