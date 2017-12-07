import React from 'react'
import ReactDOM from 'react-dom'
import {IndexRoute, Route, Router, browserHistory} from 'react-router'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'

import {logInUsingJwt} from './actions'
import * as components from './components'
import * as errorHandler from './errorHandler'
import {loggerMiddleware, errorReportingMiddleware} from './middleware'
import {reducer} from './reducers'
import {getLocalJwt, syncErrorHandlerUserContext, syncJwtToLocal,
  autoRefreshJwt} from './utils'

import './index.css'

// Initialize the error handler in an early stage
errorHandler.init()

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

const router = (
  <Router history={browserHistory}>
    <Route path="/log-in/:authProvider/" component={components.CompleteLogIn} />
    <Route path="/" component={components.App}>
      <IndexRoute component={components.Home} title="Home" />
      <Route path="lookup-register/" component={components.LookUpRegister}
             title="Look up and register" />
      <Route path="manage/organizations-events/" component={components.ManageOrganizationsEvents}/>
      <Route path="*" component={components.Error404} />
    </Route>
  </Router>
)

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      {router}
    </Provider>,
    document.getElementById('root')
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
