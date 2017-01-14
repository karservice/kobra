Kobra
=====

Architecture
------------
Kobra roughly consists of an HTTP API that tries to be more or less RESTful, and
a web client that uses that API. This means that all functionality available in 
the web client is also available through the API. 

API authentication
------------------
### Short term token
The web client uses JWTs (JSON Web Tokens), i.e. short term tokens, to 
authenticate against the API. These tokens have a short lifespan (in the order 
of minutes) and must be renewed regularly. They are therefore not suitable for 
services.

These tokens are used by setting the Authorization HTTP header for each request 
to `JWT <token>`.

### Long term token (for services)
Long term tokens, suitable for service consumers, can be issued on request.

These tokens are used by setting the Authorization HTTP header for each request 
to `Token <token>`.

API use cases
-------------
### Get a student's union membership
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

(*) Your account must be allowed to use the API. If not, you will receive a 403 
status code.

Setting up a development environment
------------------------------------
These instructions assume you have Python >= 3.5 and Node.js installed. A 
virtualenv setup is strongly recommended. 

    pip install -r requirements.pip
    npm install
    npm run watch
    ./manage.py runserver

Design assumptions
------------------
* Ticket sales are not interesting per se, but utilized union member discounts 
are.
