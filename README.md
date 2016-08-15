Kobra
=====

Architecture
------------
Kobra is an API-first application. This means that all exposed 
functionality should be accessible through the public API. The web interface
is therefore only one of several possible consumers of the API.

Setting up a development environment
------------------------------------
These instructions assume you have Python and Node.js installed. A 
virtualenv setup is strongly recommended. 

    pip install -r requirements.pip
    npm install

Design assumptions
------------------
* Ticket sales are not interesting per se, but utilized union member discounts are.
