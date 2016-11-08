import {fromJS, Map} from 'immutable'

import {actionTypes} from './actions'
import {
  apiRequestIsFailure, apiRequestIsPending, apiRequestIsSuccess
} from './api'

const apiRequestStatusReducer = (state, action, path) => {
  return state
    .setIn([path, '_isPending'],
      apiRequestIsPending(action) ? true : false)
    .setIn([path, '_error'],
      apiRequestIsFailure(action) ? action.payload : null)
}

const apiRequestReducer = (state, action, path,
                           successReducer=(state, action, path) => (
                             action.payload.reduce((state, item) => (
                               state.setIn([path, item.url], fromJS(item).set('_changes', Map()))
                             ), state)
                           ),
                           failureReducer=(state, action, path) => (state),
                           pendingReducer=(state, action, path) => (state)) => {
  state = apiRequestStatusReducer(state, action, path)

  if (apiRequestIsSuccess(action)) {
    return successReducer(state, action, path)
  } else if (apiRequestIsFailure(action)) {
    return failureReducer(state, action, path)
  } else {
    return pendingReducer(state, action, path)
  }
}

const initialCollectionMap = Map.of(
  '_isPending', false,
  '_error', null
)

const initialState = Map.of(
  'auth', initialCollectionMap
    .set('email', '')
    .set('password', '')
    .set('jwt', null),
  'discounts', initialCollectionMap,
  'discountRegistrations', initialCollectionMap,
  'events', initialCollectionMap
    .set('_active', null),
  'organizations', initialCollectionMap,
  'sections', initialCollectionMap,
  'students', initialCollectionMap
    .set('_active', null)
    .set('_searchString', ''),
  'ticketTypes', initialCollectionMap,
  'unions', initialCollectionMap,
  'users', initialCollectionMap
    .set('_active', null)
    .set('_new', Map.of(
      'email', '',
      'name', ''
    ))
)

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOG_IN:
      return apiRequestReducer(state, action, 'auth',
        (state, action, path) => (
          state
            .setIn([path, 'email'], '')
            .setIn([path, 'password'], '')
            .setIn([path, 'jwt'], action.payload.token)
            .setIn(['users', '_active'], action.payload.user)
        )
      )

    case actionTypes.LOG_OUT:
      // Basically resets the state completely.
      return state
        .merge(initialState)

    case actionTypes.GET_DISCOUNTS:
      return apiRequestReducer(state, action, 'discounts',
        (state, action, path) => (
          action.payload
            .map((discount) => ({
              url: discount.url,
              id: discount.id,
              ticketType: discount.ticket_type,
              union: discount.union,
              amount: discount.amount
            }))
            .reduce((state, item) => (
            state.setIn([path, item.url], fromJS(item))
          ), state)
        )
      )

    case actionTypes.GET_DISCOUNT_REGISTRATIONS:
      return apiRequestReducer(state, action, 'discountRegistrations')

    case actionTypes.GET_EVENTS:
      return apiRequestReducer(state, action, 'events')

    case actionTypes.GET_ORGANIZATIONS:
      return apiRequestReducer(state, action, 'organizations')

    case actionTypes.GET_SECTIONS:
      return apiRequestReducer(state, action, 'sections')

    case actionTypes.GET_STUDENT:
      return apiRequestReducer(state, action, 'students',
        (state, action, path) => (
          // Success
          state
            .setIn([path, '_searchString'], '')
            .setIn([path, '_active'], action.payload.url)
            .setIn([path, action.payload.url], Map.of(
              'url', action.payload.url,
              'id', action.payload.id,
              'name', action.payload.name,
              'liuId', action.payload.liu_id,
              'union', action.payload.union,
              'section', action.payload.section
            ))
            .set('discountRegistrations',
              initialState.get('discountRegistrations'))
        ), (state, action, path) => (
          // Failure
          state.setIn([path, '_searchString'], '')
        ), (state, action, path) => (
          // Pending
          state.set(path, initialState.get(path))
        ))

    case actionTypes.GET_TICKET_TYPES:
      return apiRequestReducer(state, action, 'ticketTypes')

    case actionTypes.GET_UNIONS:
      return apiRequestReducer(state, action, 'unions')

    case actionTypes.GET_USERS:
      return apiRequestReducer(state, action, 'users')

    case actionTypes.REGISTER_DISCOUNT:
      return apiRequestReducer(state, action, 'discountRegistrations',
        (state, action, path) => {
          return state
            .setIn([path, action.payload.url], fromJS(action.payload))
        })

    case actionTypes.SET_EMAIL:
      return state.setIn(['auth', 'email'], action.payload)

    case actionTypes.SET_EVENT:
      return state
        .setIn(['events', '_active'], action.payload)
        .set('students', initialState.get('students'))
        .set('discountRegistrations', initialState.get('discountRegistrations'))

    case actionTypes.SET_ORGANIZATION_ADMINS:
      return state.setIn(['organizations', action.payload.organizationUrl, '_changes', 'admins'], fromJS(action.payload.adminUrls))

    case actionTypes.SET_ORGANIZATION_NAME:
      return state.setIn(['organizations', action.payload.organizationUrl, '_changes', 'name'], fromJS(action.payload.value))

    case actionTypes.SET_PASSWORD:
      return state.setIn(['auth', 'password'], action.payload)

    case actionTypes.SET_STUDENT_SEARCH_STRING:
      return state
        .setIn(['students', '_searchString'], action.payload)

    case actionTypes.UNREGISTER_DISCOUNT:
      return apiRequestReducer(state, action, 'discountRegistrations',
        (state, action, path) => (
          state.deleteIn([path, action.payload])
        )
      )

    default:
      return state
  }
}

export {reducer}
