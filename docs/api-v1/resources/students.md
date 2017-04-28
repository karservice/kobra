# Students
Not to be confused with [Users](users.md).

## Object schema
| Name | Type | Description |
| --- | --- | --- |
| `url` | Canonical [URL](/api-v1/data-types.md#url) | This will always be based on the canonical ID, regardless of request URL. |
| `id` | Canonical [ID](/api-v1/data-types.md#id) | This is equal to the student's norEduPersonLIN. |
| `liu_id` | String | LiU ID. |
| `name` | String | Full name. |
| `union` | [Union](unions.md) [URL](/api-v1/data-types.md#url) | Student union for the current semester. |
| `section` | Section [URL](/api-v1/data-types.md#url) | Deprecated. Always `null` for backward compatibility. |
| `liu_lin` | String | LiU-specific UUID, returned by Sesam. |
| `email` | String | Email address. |
| `last_updated` | [Date/Time](/api-v1/data-types.md#datetime) | When the student's data was last fetched from Sesam. |

{% method %}
## Get a student
Get a single student. Only exact matches are accepted.

{% common %}
#### Request
Get by canonical ID (norEduPersonLIN):
{% sample lang="http" %}
```http
GET /api/v1/students/:id/
```
Get by Mifare ID:
{% sample lang="http" %}
```http
GET /api/v1/students/:mifare-id/
```
Get by LiU ID:
{% sample lang="http" %}
```http
GET /api/v1/students/:liu-id/
```
{% common %}
##### Parameters
| Name | Type | Description |
| --- | --- | --- |
| `expand` | [Expansion](/api-v1/expansions.md) | Allowed expansions: `union`, ~~`section`~~ |

#### Response
A student object.

##### Example response
```json
{
  "url": "https://kobra.karservice.se/api/v1/students/25faeebb-5810-4484-a69c-960d1b77a261/",
  "id": "25faeebb-5810-4484-a69c-960d1b77a261",
  "liu_id": "oller120",
  "name": "Olle Vidner",
  "union": "https://kobra.karservice.se/api/v1/unions/601ec16c-efa4-4605-9651-c0de8fedb718/",
  "section": null,
  "liu_lin": "bcbb39b7-5508-43a3-8c85-f835b1e5f9af",
  "email": "oller120@student.liu.se",
  "last_updated": "2017-01-14T22:19:32.132092Z"
}
```
With `?expand=union`:
```json
{
  "url": "https://kobra.karservice.se/api/v1/students/25faeebb-5810-4484-a69c-960d1b77a261/",
  "id": "25faeebb-5810-4484-a69c-960d1b77a261",
  "liu_id": "oller120",
  "name": "Olle Vidner",
  "union": {
    "url": "https://kobra.karservice.se/api/v1/unions/601ec16c-efa4-4605-9651-c0de8fedb718/",
    "id": "601ec16c-efa4-4605-9651-c0de8fedb718",
    "name": "LinTek"
  },
  "section": null,
  "liu_lin": "bcbb39b7-5508-43a3-8c85-f835b1e5f9af",
  "email": "oller120@student.liu.se",
  "last_updated": "2017-01-14T22:19:32.132092Z"
}
```
{% endmethod %}
