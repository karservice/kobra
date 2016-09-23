# Alpine is preferred, but Oracle only works with glibc.
# FROM alpine:3.4
FROM ubuntu:xenial

RUN mkdir /src
WORKDIR /src

ENV NODE_ENV=production \
    DJANGO_SETTINGS_MODULE=kobra.settings.production \
    PYTHONPATH=/src:$PYTHONPATH \
    PYTHONUNBUFFERED=true

ADD ./requirements.apt /src/requirements.apt
RUN DEBIAN_FRONTEND=noninteractive apt-get update && \
    apt-get install -y --no-install-recommends $(grep -vE "^\s*#" /src/requirements.apt | tr "\n" " ") && \
    rm -rf /var/apt/cache

# ADD ./requirements.alpine /src/requirements.alpine
# RUN apk add --no-cache $(grep -vE "^\s*#" /src/requirements.alpine | tr "\n" " ") && \
#     ln -sf /usr/bin/python3 /usr/bin/python

# The world of Oracle is a cold, dark place.
ADD ./vendor /src/vendor
RUN ln -s /src/vendor/instantclient_12_1/libclntsh.so.12.1 /src/vendor/instantclient_12_1/libclntsh.so
ENV ORACLE_HOME=/src/vendor/instantclient_12_1
ENV LD_LIBRARY_PATH=$ORACLE_HOME:/usr/glibc-compat/lib:$LD_LIBRARY_PATH

ADD ./requirements.pip /src/requirements.pip
RUN pip3 install -U pip setuptools && pip3 install -r /src/requirements.pip

ADD ./package.json /src/package.json
RUN ln -s /usr/bin/nodejs /usr/bin/node && npm install

ADD . /src

RUN npm run build && \
    DJANGO_SECRET_KEY=build DJANGO_DATABASE_URL=sqlite://// django-admin collectstatic --no-input
CMD ["/src/run-django.sh"]
EXPOSE 8000
