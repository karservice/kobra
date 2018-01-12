import {getJwt} from './selectors'

import { capture } from './errorHandler'

const actionErrorValues = {
  PENDING: null,
  SUCCESSFUL: false,
  FAILED: true
}

function ApiError(message, payload, extra) {
  this.message = message
  this.stack = (new Error()).stack
  this.payload = payload
  this.extra = extra
}
ApiError.prototype = new Error()
ApiError.prototype.name = 'ApiError'

const fetchAction = ({actionType, url, options={}, extraMeta={}, extraSuccessCallback, useAuth=false}) => (dispatch, getState) => {
  const baseAction = {
    type: actionType,
    meta: {
      url,
      ...extraMeta
    }
  }

  const dispatchSuccessful = (payload) => {
    dispatch(
      Object.assign({}, baseAction, {
        error: actionErrorValues.SUCCESSFUL,
        payload: payload
      })
    )
    if (extraSuccessCallback) extraSuccessCallback(payload)
  }

  const dispatchFailed = (error) => dispatch(
    Object.assign({}, baseAction, {
      error: actionErrorValues.FAILED,
      payload: error
    })
  )

  let defaultOptions = {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
  const authToken = getJwt(getState())
  if (useAuth && authToken) {
    defaultOptions.headers['Authorization'] = `JWT ${authToken}`
  }

  dispatch(Object.assign({}, baseAction, {
    error: actionErrorValues.PENDING
  }))

  return fetch(url, Object.assign({}, defaultOptions, options))
    .then((response) => {
      // Note that fetch resolves on any successful HTTP request, i.e. 4xx and
      // 5xx as well.

      // Empty response (in case of DELETE requests)
      if (response.status === 204) return dispatchSuccessful(null)

      return response.json().then((payload) => {
        // Is the status code 200-299?
        if (response.ok) {
          return dispatchSuccessful(payload)
        } else {
          const err = new ApiError(payload.detail ? payload.detail : response.statusText, payload, {url, options})
          capture(err)
          return dispatchFailed(err)
        }
      }, (error) => {
        // We've got something other than a JSON body. Just use the generic
        // statusText in dispatch. error.message is probably more interesting
        // technically, though.
        const apiError = new ApiError(response.statusText, error, {url, options})
        capture(apiError)
        return dispatchFailed(apiError)
      })
    }, (error) => {
      // We have a communication problem. response is a TypeError.
      const apiError = new ApiError(error.message, error, {url, options})
      // Opbeat really don't want a TypeError
      capture(apiError)
      return dispatchFailed(apiError)
    })
}

export {
  actionErrorValues,
  ApiError,
  fetchAction
}
