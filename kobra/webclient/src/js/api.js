import {Map} from 'immutable'
import request from 'superagent'

import {apiRoot} from './constants'
import {getJwt} from './selectors'

const apiAdapter = (state) => {
  const requestObjectFactory = (method, path) => {
    const requestObject = request(method, apiRoot.concat(path))
      .accept('application/json')

    const token = getJwt(state)
    if (token) {
      return requestObject.set('Authorization', 'JWT '.concat(token))
    }

    return requestObject
  }

  return {
    delete: (path) => requestObjectFactory('DELETE', path),
    get: (path) => requestObjectFactory('GET', path),
    head: (path) => requestObjectFactory('HEAD', path),
    post: (path) => requestObjectFactory('POST', path),
    put: (path) => requestObjectFactory('PUT', path),
    patch: (path) => requestObjectFactory('PATCH', path)
  }
}

const apiRequestDispatcher = (actionType, apiRequest, dispatch, getState,
  {successCallback, failureCallback, extraMeta={}}={}) => {
  // A function used to dispatch the various actions used in API requests.
  // todo: clean up the signature

  // This is reused, so make sure it is never mutated!
  const action = {
    type: actionType,
    meta: Object.assign({}, {
      _request: apiRequest
    }, extraMeta)
  }

  // Dispatch the request status action
  dispatch(action)

  // Perform the request and hook up callbacks
  apiRequest
    .then(
      (resolvedResult) => {
        // On DELETE requests, we need some kind of reference to the deleted
        // object.
        const payload = (resolvedResult.req.method === 'DELETE') ?
          resolvedResult.xhr.responseURL : resolvedResult.body

        dispatch(Object.assign({}, action, {
          payload: payload,
          meta: Object.assign({}, action.meta, {
            _requestResult: resolvedResult
          })
        }))
        if (successCallback) {
          successCallback(resolvedResult)
        }
        return resolvedResult
      },
      (rejectedResult) => {
        let error = new Error()

        if (rejectedResult.response && rejectedResult.response.body) {
          const responseBody = Object.assign({}, rejectedResult.response.body)

          // The API is not terribly consistent. Some generic errors are in the
          // detail property, some in non_field_errors.
          if (responseBody.detail) {
            error.message = responseBody.detail
            delete responseBody.detail
          } else if (responseBody.non_field_errors) {
            error.message = responseBody.non_field_errors
            delete responseBody.non_field_errors
          }

          // Set the rest of the properties of the response body to the fields
          // attribute.
          error.fields = responseBody
        } else if (rejectedResult.status === undefined) {
          error.message = "Couldn't communicate with the server. Check your " +
            "connection and try again in a few moments."
        } else if (rejectedResult.status === 500) {
          error.message = "A server error occured. The issue has been " +
            "reported and will hopefully be fixed soon. Please try again in " +
            "a few moments."
        } else {
          error.message = rejectedResult.message
        }

        dispatch(Object.assign({}, action, {
          error: true,
          payload: error,
          meta: Object.assign({}, action.meta, {
            _requestResult: rejectedResult
          })
        }))

        if (failureCallback) {
          failureCallback(rejectedResult)
        }
        return rejectedResult
      }
    )
}

const apiRequestIsFailure = (action) => (action.error === true)
const apiRequestIsPending = (action) => (action.payload === undefined)
const apiRequestIsSuccess = (action) => (
  !apiRequestIsPending(action) && !apiRequestIsFailure(action)
)

export {
  apiAdapter,
  apiRequestDispatcher,
  apiRequestIsFailure,
  apiRequestIsPending,
  apiRequestIsSuccess
}
