# -*- coding: utf-8 -*-
import uuid

from django.db import models
from django.utils.translation import ugettext_lazy as _


class StripValueMixin(object):
    strip_chars = None

    def clean(self, value, model_instance):
        value = value.strip(self.strip_chars)
        return super(StripValueMixin, self).clean(value, model_instance)


class IdField(models.UUIDField):
    def __init__(self, *args, **kwargs):
        kwargs['primary_key'] = kwargs.get('primary_key', True)
        kwargs['default'] = kwargs.get('default', uuid.uuid4)
        kwargs['editable'] = kwargs.get('editable', False)
        kwargs['verbose_name'] = kwargs.get('verbose_name', _('ID'))
        super(IdField, self).__init__(*args, **kwargs)


class MoneyField(models.DecimalField):
    def __init__(self, *args, **kwargs):
        kwargs['max_digits'] = kwargs.get('max_digits', 12)
        kwargs['decimal_places'] = 2
        super(MoneyField, self).__init__(*args, **kwargs)


class NameField(StripValueMixin, models.CharField):
    def __init__(self, *args, **kwargs):
        kwargs['max_length'] = kwargs.get('max_length', 64)
        kwargs['verbose_name'] = kwargs.get('verbose_name', _('name'))
        super(NameField, self).__init__(*args, **kwargs)


class NullCharField(models.CharField):
    """
    A nullable CharField. This is needed when the value must be unique, unless
    it's empty - null values are not considered unique.
    """
    def __init__(self, *args, **kwargs):
        kwargs['null'] = True
        kwargs['blank'] = True
        kwargs['default'] = None
        super(NullCharField, self).__init__(*args, **kwargs)

    def clean(self, value, model_instance):
        value = super(NullCharField, self).clean(value, model_instance)
        return value or None
