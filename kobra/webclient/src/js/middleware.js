import createLogger from 'redux-logger'

import {capture} from './errorHandler'

const loggerMiddleware = createLogger({
  // Transforms the state to regular JS types for easier debugging in console
  stateTransformer: (state) => state.toJS()
})

const errorReportingMiddleware = (store) => (next) => (action) => {
  try {
    return next(action)
  } catch(error) {
    error.action = action
    error.state = store.getState()
    capture(error)
    throw error
  }
}

export {errorReportingMiddleware, loggerMiddleware}
