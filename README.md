Kobra
=====
[API Documentation (Version 1)](kobra/api/v1/README.md)

[Docker Image](https://hub.docker.com/r/karservice/kobra/)

Setting up a development environment
------------------------------------
This project uses [Pipenv](https://docs.pipenv.org) and
[Yarn](https://yarnpkg.com/en/) to manage its dependencies and development
environments. Read up on their basic usage, install them and run the following
commands:

```sh
cp example.env .env
pipenv install -d
yarn
```

You may want to adapt the `.env` file to your preferences. To make student
lookups, you will need *Sesam* credentials.

To build and run a development server, run

```sh
yarn build
pipenv run django-admin migrate
pipenv run django-admin runserver
```

This will start a development server listening on port 3000 and launch your
browser with hot-reloading on frontend changes.

Alternatively, you can use Docker Compose to more closely mimic a production
scenario:
```sh
pipenv shell
docker-compose build
docker-compose run --rm app django-admin migrate
docker-compose up
```

This will start the web server on port 80.

### ADFS
The application must be available at http://dev.kobra.karservice.se (on port 80)
as seen from your local machine for the ADFS integration to work in a
development environment. Adjust your `/etc/hosts` (or equivalent) file to
accomodate this.

Project structure
-----------------
* `bin`: utility scripts
* `build`: frontend build artefacts
* `kobra`: backend source code
* `node_modules`: frontend build dependencies
* `public`: frontend template
* `src`: frontend source code

Architecture
------------
Kobra roughly consists of an HTTP API that tries to be more or less RESTful, and
a web client that uses that API. This means that all functionality available in
the web client is also available through the API. The API backend is a
[Django](https://www.djangoproject.com) application using
[Django REST Framework](http://www.django-rest-framework.org). The web frontend
is a single-page JavaScript application, bootstrapped using
[create-react-app](https://github.com/facebookincubator/create-react-app). It
uses [Redux](https://redux.js.org) to manage its state.

The complete application (including its Docker environment) is developed with
[The Twelve-Factor App](https://www.12factor.net) in mind. Read it.

### Data sources and integrations
The Kobra application is dependent on three backing services:

1. A PostgreSQL database for storing cached student data, events, organizations,
discount registrations and all other application data. This is a SQLite database
in the default development settings.
2. The *Sesam* student service, a SOAP service provided by LiU to make lookups
of student data. The client implementation is provided by the
[python-sesam](https://github.com/ovidner/python-sesam) package.
3. The ADFS single sign-on service provided by LiU. The integration is provided
by the [python-social-auth-liu](https://github.com/ovidner/python-social-auth-liu)
package.

### Permissions
The default permissions model is deliberately kept simple. Any user with a LiU
ID may log in with their LiU ID credentials. However, the user must be added as
an organization administrator before any meaningful queries can be carried out.
When added as an admin for *any* organization, the user may query for student
data and perform discount registrations for all of the organization's events.
Existing administrators may also add and remove other administrators for the
organization.

### Build and runtime environments
Docker is used to build and run the application in a production environment (see
the dedicated, private repo for this). You can also use it to run in a
development setting, preferably using Docker Compose (see the instructions
above). The `Dockerfile` as well as the Docker Compose definitions (in this repo
and the production dito) are *by themselves* considered the documentation for
how to get the application to build and run.

Third-party API clients
-----------------------
This repository includes no programmatic API client. Please refer to the
following projects for API client implementations or use them as inspiration to
make one in your language:

* Ruby: https://github.com/studentorkesterfestivalen/kobra_client

*Made a client and want it listed here? Submit a pull request!*
