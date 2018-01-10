import {fromJS, Map} from 'immutable'

import {actionTypes} from './actions'
import {actionErrorValues} from './api'

const apiRequestStatusReducer = (state, action, path) => {
  return state
    .setIn([path, '_isPending'], action.error === actionErrorValues.PENDING)
    .setIn([path, '_error'],
      (action.error === actionErrorValues.FAILED) ? action.payload : null)
}

const apiRequestReducer = (state, action, path,
                           successReducer=(state, action, path) => (
                             action.payload.reduce((state, item) => (
                               state.setIn([path, item.url], fromJS(item))
                             ), state)
                           ),
                           failureReducer=(state, action, path) => (state),
                           pendingReducer=(state, action, path) => (state)) => {
  state = apiRequestStatusReducer(state, action, path)

  // We use the action.error property to indicate request status. See the API adapter.
  switch (action.error) {
    case actionErrorValues.SUCCESSFUL:
      return successReducer(state, action, path)
    case actionErrorValues.FAILED:
      return failureReducer(state, action, path)
    default:
      return pendingReducer(state, action, path)
  }
}

const initialCollectionMap = Map.of(
  '_isPending', false,
  '_error', null
)

const initialState = Map.of(
  'auth', initialCollectionMap
    .set('jwt', null),
  'discounts', initialCollectionMap,
  'discountRegistrations', initialCollectionMap,
  'events', initialCollectionMap
    .set('_active', null),
  'eventDiscountRegistrationSummaries', initialCollectionMap,
  'organizations', initialCollectionMap,
  'students', initialCollectionMap
    .set('_active', null),
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

    case actionTypes.GET_EVENT_DISCOUNT_REGISTRATION_SUMMARY:
      if (action.error === actionErrorValues.SUCCESSFUL) {
        return state.setIn(['eventDiscountRegistrationSummaries', action.meta.event], fromJS(action.payload.map((item) => ({
          timespan: item.timespan,
          discountRegistrations: item.discount_registrations
        }))))
      } else {
        return state
      }

    case actionTypes.GET_EVENTS:
      return apiRequestReducer(state, action, 'events')

    case actionTypes.GET_ORGANIZATIONS:
      return apiRequestReducer(state, action, 'organizations')

    case actionTypes.GET_STUDENT:
      return apiRequestReducer(state, action, 'students',
        (state, action, path) => (
          // Success
          state
            .setIn([path, '_active'], action.payload.url)
            .setIn([path, action.payload.url], Map.of(
              'url', action.payload.url,
              'id', action.payload.id,
              'name', action.payload.name,
              'liuId', action.payload.liu_id,
              'union', action.payload.union,
            ))
            .set('discountRegistrations',
              initialState.get('discountRegistrations'))
        ),
        undefined,
        (state, action, path) => (
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

    case actionTypes.SET_EVENT:
      return state
        .setIn(['events', '_active'], action.payload)

    case actionTypes.UNREGISTER_DISCOUNT:
      return apiRequestReducer(state, action, 'discountRegistrations',
        (state, action, path) => (
          state.deleteIn([path, action.meta.discountRegistrationUrl])
        )
      )

    default:
      return state
  }
}

export {reducer}
