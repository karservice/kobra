import createLogger from 'redux-logger'

export const loggerMiddleware = createLogger({
  // Transforms the state to regular JS types for easier debugging in console
  stateTransformer: (state) => state.toJS()
})
