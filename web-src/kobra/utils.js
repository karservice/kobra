import {Map} from 'immutable'
import jwtDecode from 'jwt-decode'


import {refreshJwt} from './actions'
import {apiRoot, localJwtKey, jwtRefreshMargin} from './constants'
import {getJwt} from './selectors'

const getLocalJwt = () => {
  try {
    return window.localStorage.getItem(localJwtKey)
  } catch (error) {
    return undefined
  }

}

const intersection = (secondIterable, predicate) => (elem) => (
  /*
  For use in filter functions, e.g.:
    const array1 = [
      {a: 1},
      {a: 2},
      {a: 3}
    ]
    const array2 = [
      {b: 1},
      {b: 3},
      {b: 1}
    ]

    array1.filter(
      intersection(array2, (array1Elem, array2Elem) => (
        array1Elem.a === array2Elem.b
      ))
    )

  Resulting in:
    [
      {a: 1},
      {a: 3}
    ]

  */
  secondIterable.some((secondElem) => (
    predicate(elem, secondElem)
  ))
)

const observeStore = (store, select, onChange) => {
  // Observes a Redux store. store should be a Redux store. select should be a
  // callback accepting the state as argument, returning a slice of the state to
  // observe. onChange should be a callback accepting the state as argument.
  // https://github.com/reactjs/redux/issues/303#issuecomment-125184409
  let currentState = select(store.getState())

  const handleChange = () => {
    const nextState = select(store.getState())
    if (nextState !== currentState) {
      currentState = nextState
      onChange(currentState)
    }
  }

  return store.subscribe(handleChange)
}

const syncJwtToLocal = (store) => {
  const saveJwt = (value) => {
    window.localStorage.setItem(localJwtKey, value)
  }
  return observeStore(store, getJwt, saveJwt)
}

const autoRefreshJwt = (store) => {
  let activeTimer = null

  const performRefresh = () => {
    console.log('performRefresh')
    store.dispatch(refreshJwt())
    console.log('performRefresh done')
  }

  const setUpTimer = (jwt) => {
    console.log('activeTimer', activeTimer)
    if (activeTimer) {
      window.clearTimeout(activeTimer)
    }
    const expiryTime = jwtDecode(jwt).exp
    console.log(expiryTime * 1000)
    console.log(Date.now())
    const timeToRefresh = (expiryTime * 1000) - Date.now() - jwtRefreshMargin
    console.log(timeToRefresh)

    if (timeToRefresh <= 0) {
      activeTimer = null
      performRefresh()
    } else {
      activeTimer = window.setTimeout(
        performRefresh,
        timeToRefresh
      )
    }
  }

  return observeStore(store, getJwt, setUpTimer)
}

export {
  autoRefreshJwt,
  getLocalJwt,
  intersection,
  observeStore,
  syncJwtToLocal
}
