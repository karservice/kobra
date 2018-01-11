from django import forms
from django.utils.translation import ugettext_lazy as _

from . import models


class AlwaysChangedModelForm(forms.ModelForm):
    def has_changed(self):
        if self.instance._state.adding:
            return True
        return super().has_changed()


class UserCreationForm(forms.ModelForm):
    class Meta:
        model = models.User
        fields = ['name', 'email']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_unusable_password()
        if commit:
            user.save()
        return user


def ticket_type_form_factory():
    """
    Dynamically generates a model form for TicketType with shortcut fields for
    settings discounts.
    """

    unions = {
        u.name.lower(): u
        for u in models.Union.objects.order_by('name')
    }

    field_name_prefix = 'discount_'

    fields = {
        f'{field_name_prefix}{key}': forms.DecimalField(required=False, min_value=0, label=_(f'{union.name} discount'))
        for (key, union) in unions.items()
    }

    # Dynamically constructs a ModelForm with all the fields we want. Check out
    # Django's modelform_factory for how this works.
    _TicketTypeForm = type(forms.ModelForm)('_TicketTypeForm', (forms.ModelForm,), {
        'Meta': type('Meta', (object,), {
            'model': models.TicketType,
            'fields': [
                'name',
                *fields.keys(),
                'personal_discount_limit',
            ]
        }),
        **fields,
    })

    class TicketTypeForm(_TicketTypeForm):
        def __init__(self, *args, **kwargs):
            instance = kwargs.get('instance')
            if instance:
                kwargs['initial'] = {
                    **{
                        f'{field_name_prefix}{d.union.name.lower()}': d.amount
                        for d in models.Discount.objects.filter(ticket_type=instance).select_related('union')
                    },
                    **kwargs.get('initial', {}),
                }
            super().__init__(*args, **kwargs)

        def save(self, commit=True):
            instance = super().save(commit=commit)
            if commit:
                for (union_alias, union) in unions.items():
                    models.Discount.objects.update_or_create(
                        ticket_type=instance,
                        union=union,
                        defaults=dict(
                            amount=self.cleaned_data[f'{field_name_prefix}{union_alias}'] or 0,
                        ),
                    )

            return instance

    return TicketTypeForm
