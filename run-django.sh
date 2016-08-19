#!/bin/sh
# Fail on non-zero exit status
set -e

# Collect static content for Django
django-admin collectstatic --noinput

# Don't fail on non-zero exit status (we don't care that much about Opbeat)
set +e

# Report backend release to Opbeat
curl https://intake.opbeat.com/api/v1/organizations/${OPBEAT_BACKEND_ORGANIZATION_ID}/apps/${OPBEAT_BACKEND_APP_ID}/releases/ \
  -H "Authorization: Bearer ${OPBEAT_BACKEND_SECRET_TOKEN}" \
  -d rev=`git log -n 1 --pretty=format:%H` \
  -d branch=`git rev-parse --abbrev-ref HEAD` \
  -d machine=`hostname` \
  -d status=machine-completed

# Report frontend release to Opbeat
curl https://intake.opbeat.com/api/v1/organizations/${OPBEAT_FRONTEND_ORGANIZATION_ID}/apps/${OPBEAT_FRONTEND_APP_ID}/releases/ \
  -H "Authorization: Bearer ${OPBEAT_FRONTEND_SECRET_TOKEN}" \
  -d rev=`git log -n 1 --pretty=format:%H` \
  -d branch=`git rev-parse --abbrev-ref HEAD` \
  -d machine=`hostname` \
  -d status=machine-completed

# Fail on non-zero exit status
set -e

gunicorn kobra.wsgi -c /src/gunicorn-conf.py
