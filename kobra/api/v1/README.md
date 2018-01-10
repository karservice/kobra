Kobra API (Version 1)
=====================
Interactive documentation of the API is available at
https://kobra.karservice.se/api/docs/. All documentation assumes that you are at
least vaguely familiar with the semantics of HTTP and REST APIs.

# Authentication
## Short term token
The web client uses JWTs (JSON Web Tokens), i.e. short term tokens, to
authenticate against the API. These tokens have a short lifespan (in the order
of minutes) and must be renewed regularly. They are therefore not suitable for
services.

These tokens are used by setting the `Authorization` HTTP header for each request
to `JWT <token>`.

## Long term token (for services)
Long term tokens, suitable for service consumers, can be issued on request.

These tokens are used by setting the `Authorization` HTTP header for each request
to `Token <token>`.

# Common use cases
## Get a student's union membership
One student can be fetched at a time, by making an authenticated and authorized(*) GET request to
`https://kobra.karservice.se/api/v1/students/<id>/`, where `<id>` can be one of
the following:

* LiU ID
* LiU card number in decimal form (Mifare UID, readable with a card reader and
also printed on the backside of the card)
* norEduPersonLIN (an immutable, unique identifier primarily used to integrate
with other services such as ADFS)

Only exact matches are returned. The JSON response will basically look like the
following:

```json
{
  "url": "https://kobra.karservice.se/api/v1/students/25faeebb-5810-4484-a69c-960d1b77a261/",
  "id": "25faeebb-5810-4484-a69c-960d1b77a261",
  "liu_id": "oller120",
  "name": "Olle Vidner",
  "union": "https://kobra.karservice.se/api/v1/unions/601ec16c-efa4-4605-9651-c0de8fedb718/",
  "section": "https://kobra.karservice.se/api/v1/sections/83666930-90b1-463f-a211-d97247a7f9a6/",
  "liu_lin": "bcbb39b7-5508-43a3-8c85-f835b1e5f9af",
  "email": "oller120@student.liu.se",
  "last_updated": "2017-01-14T22:19:32.132092Z"
}
```

By using the `?expand=union,section` GET parameter (i.e.
`https://kobra.karservice.se/api/v1/students/<id>/?expand=union,section`), the
union and section data will be included in the response, like this:

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
  "section": {
    "url": "https://kobra.karservice.se/api/v1/sections/83666930-90b1-463f-a211-d97247a7f9a6/",
    "id": "83666930-90b1-463f-a211-d97247a7f9a6",
    "name": "M"
  },
  "liu_lin": "bcbb39b7-5508-43a3-8c85-f835b1e5f9af",
  "email": "oller120@student.liu.se",
  "last_updated": "2017-01-14T22:19:32.132092Z"
}
```

Please note that LiU card numbers will never be returned from the API, due to
privacy decisions made by LiU.

(*) See _API authentication_ above. Your account must also be allowed to use the
API. If not, you will receive a 403 status code.

# Data types
The API uses some standardized data types.

## Date/Time
A point in time is represented by an
[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted string. GMT/UTC
is the only time zone used in responses. All time zones are accepted in
requests, however.

Examples:
* `2000-01-01T12:00:00Z`
* `2000-01-01T12:00:00.123456Z`
* `2000-01-01T12:00:00+00:00`
* `2000-01-01T12:00:00.123456+00:00`

## ID
All canonical IDs in this API are UUIDs, formatted as lowercase hex strings with
dashes.

Example: `25faeebb-5810-4484-a69c-960d1b77a261`

## norEduPersonLIN
Student IDs are equal to the corresponding student's `norEduPersonLIN`, which is a global,
immutable identifier used across different platforms within and outside LiU.
Use this to deterministically address a student, for instance when making
integrations with other platforms (such as ADFS).

Part of the *norEdu* standard.

## URL
In general, URLs are used to refer to API resources. Full URLs, including scheme
and host are used in these cases.

Example: `https://kobra.karservice.se/api/v1/students/25faeebb-5810-4484-a69c-960d1b77a261/`

# Expanding objects
Most API resources contain relations to other resources, represented by URLs.
Certain resources allow expanding selected properties, meaning that the whole
referenced object will be included in the response. This is achieved by setting
the `expand` request parameter accordingly.

The resources supporting expansion of objects note this in their corresponding
documentation.

Multiple properties can be expanded by separating them with commas.

Expansions are only allowed on read-only requests.

# Changelog
## 2017-03-19
* Sections are deprecated, due to the data being largely unreliable. This means
that the `section` response property in `student` requests will always be `null`
from now on.
