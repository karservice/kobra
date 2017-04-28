# Discount registrations
Discount registrations represent utilizations of a [discount](discounts.md) by a 
certain [student](students.md).

## Object schema
| Name | Type | Description |
| --- | --- | --- |
| `url` | Canonical [URL](/api-v1/data-types.md#url) | URL to the resource. |
| `id` | string | UUID of the resource. |
| `discount` | string | URL to the [discount](discounts.md) for which this discount registration is made. |
| `student` | string | URL to the [student](students.md) for which the discount has been registered. |
| `timestamp` | string | An ISO 8601 formatted timestamp, specifying the date and time at which this registration was made. |


{% method %}
## List all discounts

{% common %}
#### Request
{% sample lang="http" %}
```http
GET /api/v1/discount-registrations/
```

##### Parameters
| Name | Type | Description |
| --- | --- | --- |
| `event` | string ([Event](events.md) ID) | If supplied, only discount registrations related to this event will be returned. |
| `student` | string ([Student](students.md) ID) | If supplied, only discount registrations related to this student will be returned. |

{% common %}
#### Response
An array of [discount registration objects](#object-schema).

{% endmethod %}

{% method %}
## Get a summary
Discount registration summaries aggregate the number of discount registrations 
made for a certain discount during a certain timespan. The numbers are grouped 
by discount and timespan.

### Summary object schema
| Name | Type | Description |
| --- | --- | --- |
| `timespan` | string | An ISO 8601 formatted timestamp, specifying the start for. |
| `discount_registrations` | array | An array of summary points. One item per discount. |

#### Summary point object schema
| Name | Type | Description |
| --- | --- | --- |
| `discount` | string | URL to the [discount](discounts.md)  |
| `count` | integer | The number of registrations for the discount during the given timespan. |

{% common %}
#### Request
{% sample lang="http" %}
```http
GET /api/v1/discount-registrations/summary/
```
##### Parameters
| Name | Type | Description |
| --- | --- | --- |
| `resolution` | string (`year`&#124;`month`&#124;`day`&#124;`hour`&#124;`minute`&#124;`second`) | The resolution of the timespan. Default is `hour`. |
| `event` | string ([Event](events.md) ID) | If supplied, only discount registrations related to this event will be considered in the summary. |
| `student` | string ([Student](students.md) ID) | If supplied, only discount registrations related to this student will be considered in the summary. |

{% common %}
#### Response
An array of summary objects.
##### Example response
```json
[
  {
    "timespan": "2016-12-08T16:00:00Z",
    "discount_registrations": [
      {
        "discount": "https://kobra.karservice.se/api/v1/discounts/2cc622c4-5973-475f-9748-7520879693e2/",
        "count": 52
      }
    ]
  },
  {
    "timespan": "2016-12-08T17:00:00Z",
    "discount_registrations": [
      {
        "discount": "https://kobra.karservice.se/api/v1/discounts/2cc622c4-5973-475f-9748-7520879693e2/",
        "count": 25
      },
      {
        "discount": "https://kobra.karservice.se/api/v1/discounts/3341446e-a523-4951-a0df-40942ba3f46f/",
        "count": 29
      },
      {
        "discount": "https://kobra.karservice.se/api/v1/discounts/dff54e06-f218-4be2-b7f6-5fc7340c76b6/",
        "count": 9
      }
    ]
  }
]
```
{% endmethod %}

{% method %}
## Get a discount registration

{% common %}
#### Request
{% sample lang="http" %}
```http
GET /api/v1/discount-registrations/:id/
```
{% common %}

#### Response
A [discount registration object](#object-schema).
{% endmethod %}

{% method %}
## Register a discount (add a discount registration)


{% common %}
#### Request
{% sample lang="http" %}
```http
POST /api/v1/discount-registrations/
```

##### Properties
* `discount`
* `student`
* `timestamp` (not required)

See the [object schema](#object-schema).
{% common %}

#### Response
A [discount registration object](#object-schema).
{% endmethod %}

{% method %}
## Unregister a discount (remove a discount registration)


{% common %}
#### Request

{% sample lang="http" %}
```http
DELETE /api/v1/discount-registrations/:id/
```
{% common %}

#### Response
Empty payload.
{% endmethod %}
