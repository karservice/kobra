# Discounts
Discounts are discount *definitions*, telling how much a [union](unions.md) 
discounts a certain [ticket type](ticket-types.md).

### Object schema
| Name | Type | Description |
| --- | --- | --- |
| `url` | string | URL to the resource. |
| `id` | string | UUID of the resource. |
| `ticket_type` | string | The [ticket type](ticket-types.md) for which this discount is given. |
| `union` | string | The [union](unions.md) for which this discount is given. |
| `amount` | string | A string formatted positive decimal number, representing the discount amount. |

{% method %}
## List all discounts

{% common %}
#### Request
{% sample lang="http" %}
```http
GET /api/v1/discounts/
```
{% common %}
#### Response
An array of discount objects.

{% endmethod %}

{% method %}
## Get a discount

{% common %}
#### Request
{% sample lang="http" %}
```http
GET /api/v1/discounts/:id/
```
{% common %}

#### Response
A discount object.
{% endmethod %}

{% method %}
## Add or update a discount


{% common %}
#### Request
{% sample lang="http" %}
```http
POST /api/v1/discounts/
```
```http
PUT /api/v1/discounts/:id/
```
```http
PATCH /api/v1/discounts/:id/
```
##### Properties
* `ticket_type`
* `union`
* `amount`
{% common %}

#### Response
A discount object.
{% endmethod %}

{% method %}
## Remove a discount


{% common %}
#### Request

{% sample lang="http" %}
```http
DELETE /api/v1/discounts/:id/
```
{% common %}

#### Response
Empty payload.
{% endmethod %}
