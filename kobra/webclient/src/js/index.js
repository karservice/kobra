import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import {IndexRoute, Route, Router, hashHistory} from 'react-router'
import {Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import {logInUsingJwt} from './actions'
import {Error404, Home} from './dumbComponents'
import {App, LookUpStudents, LookUpRegister} from './smartComponents'
import {loggerMiddleware} from './middleware'
import {reducer} from './reducers'
import {getLocalJwt, syncJwtToLocal, autoRefreshJwt} from './utils'


const middleware = [
  thunk
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
    <IndexRoute component={Home} />
    <Route path="lookup-register/" component={LookUpRegister} name="lookUpRegister" title="Look up and register" />
    <Route path="*" component={Error404} title="Page not found" />
  </Route>
)

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={hashHistory}>
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
}

bootstrap()
render()
