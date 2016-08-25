import 'babel-polyfill'

// Initialize the error handler in an early stage
import * as errorHandler from './errorHandler'
errorHandler.init()

import React from 'react'
import ReactDOM from 'react-dom'
import {IndexRoute, Route, Router, browserHistory} from 'react-router'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'

import {logInUsingJwt} from './actions'
import {Error404, Home} from './dumbComponents'
import {App, LookUpStudents, LookUpRegister} from './smartComponents'
import {loggerMiddleware, errorReportingMiddleware} from './middleware'
import {reducer} from './reducers'
import {getLocalJwt, syncErrorHandlerUserContext, syncJwtToLocal,
  autoRefreshJwt} from './utils'

const middleware = [
  errorReportingMiddleware,
  thunkMiddleware
]
if (process.env.NODE_ENV !== "production") {
  middleware.push(loggerMiddleware)
}

export const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

const routes = (
  <Route path="/" component={App}>
    <IndexRoute component={Home} title="Home" />
    <Route path="lookup-register/" component={LookUpRegister}
           title="Look up and register" />
    <Route path="*" component={Error404} title="Page not found" />
  </Route>
)

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={browserHistory}>
        {routes}
      </Router>
    </Provider>,
    document.getElementById('app')
  )
}

const bootstrap = () => {
  const localJwt = getLocalJwt()

  if (localJwt !== null) {
    store.dispatch(logInUsingJwt(localJwt))
  }

  store.subscribe(render)
  autoRefreshJwt(store)
  syncJwtToLocal(store)
  syncErrorHandlerUserContext(store)
}

bootstrap()
render()
