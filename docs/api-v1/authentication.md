# Authentication
### Short term token
The web client uses JWTs (JSON Web Tokens), i.e. short term tokens, to 
authenticate against the API. These tokens have a short lifespan (in the order 
of minutes) and must be renewed regularly. They are therefore not suitable for 
services.

These tokens are used by setting the `Authorization` HTTP header for each request 
to `JWT <token>`.

### Long term token (for services)
Long term tokens, suitable for service consumers, can be issued on request.

These tokens are used by setting the `Authorization` HTTP header for each request 
to `Token <token>`.
