import {fromJS, List, Map} from 'immutable'

import {actionTypes} from './actions'
import {
  apiRequestIsFailure, apiRequestIsPending, apiRequestIsSuccess
} from './api'

const apiRequestStatusReducer = (state, action, path) => {
  return state
    .setIn(['meta', path, 'isPending'],
      apiRequestIsPending(action) ? true : false)
    .setIn(['meta', path, 'error'],
      apiRequestIsFailure(action) ? action.payload : null)
}

const apiRequestReducer = (state, action, path,
                           successReducer=(state, action, path) => (
                             state.set(path, fromJS(action.payload))),
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

const defaultMetaMap = Map.of(
  'isPending', false,
  'error', null
)

const initialState = Map.of(
  // The metadata is stored separately to keep the actual entities clean.
  'meta', Map.of(
    'discounts', defaultMetaMap,
    'discountRegistrations', defaultMetaMap,
    'events', defaultMetaMap.set(
      'selected', null
    ),
    'logIn', Map.of(
      'email', '',
      'password', '',
      'isPending', false,
      'error', null
    ),
    'organizations', defaultMetaMap,
    'sections', defaultMetaMap,
    'student', defaultMetaMap.set(
      'searchString', ''
    ),
    'ticketTypes', defaultMetaMap,
    'unions', defaultMetaMap
  ),
  'discounts', List.of(
    // Map.of(
    //   'url', null,
    //   'id', null,
    //   'ticketType', null,
    //   'union', null,
    //   'amount', null
    // )
  ),
  'discountRegistrations', List.of(
    // Map.of(
    //   'url', null,
    //   'id', null,
    //   'discount', null,
    //   'student', null,
    //   'timestamp', null
    // )
  ),
  'events', List.of(
    // Map.of(
    //   'url', null,
    //   'id', null,
    //   'name', null,
    //   'organization', null,
    // )
  ),
  'jwt', null,
  'organizations', List.of(
    // Map.of(
    //   'url', null,
    //   'id', null,
    //   'name', null
    // )
  ),
  'sections', List.of(
    // Map.of(
    //   'url', null,
    //   'id', null,
    //   'name', null
    // )
  ),
  'student', null,
  // Map.of(
  //   'url', null,
  //   'id', null,
  //   'name', null,
  //   'liuId', null,
  //   'union', null,
  //   'section', null
  // ),
  'ticketTypes', List.of(
    // Map.of(
    //   'url', null,
    //   'id', null,
    //   'name', null,
    //   'event', null
    // )
  ),
  'unions', List.of(
    // Map.of(
    //   'url', null,
    //   'id', null,
    //   'name', null
    // )
  ),
  'user', Map.of(
    // 'url', null,
    // 'id', null,
    // 'name', null,
    // 'email', null
  )
)

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOG_IN:
      return apiRequestReducer(state, action, 'logIn',
        (state, action, path) => (
          state
            .setIn(['meta', path, 'email'], '')
            .setIn(['meta', path, 'password'], '')
            .set('jwt', action.payload.token)
            .set('user', fromJS(action.payload.user))
        )
      )

    case actionTypes.LOG_OUT:
      // Basically resets the state completely.
      return state
        .merge(initialState)

    case actionTypes.GET_DISCOUNTS:
      return apiRequestReducer(state, action, 'discounts',
        (state, action, path) => (
          state.set(path, fromJS(action.payload.map((discount) => ({
            url: discount.url,
            id: discount.id,
            ticketType: discount.ticket_type,
            union: discount.union,
            amount: discount.amount
          }))))
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
      return apiRequestReducer(state, action, 'student',
        (state, action, path) => (
          // Success
          state
            .setIn(['meta', path, 'searchString'], '')
            .set(path, Map.of(
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
          state.setIn(['meta', path, 'searchString'], '')
        ), (state, action, path) => (
          // Pending
          state.set(path, initialState.get(path))
        ))

    case actionTypes.GET_TICKET_TYPES:
      return apiRequestReducer(state, action, 'ticketTypes')

    case actionTypes.GET_UNIONS:
      return apiRequestReducer(state, action, 'unions')

    case actionTypes.REGISTER_DISCOUNT:
      return apiRequestReducer(state, action, 'discountRegistrations',
        (state, action, path) => {
          return state
            .set(path, state
              .get(path)
              .insert(0, fromJS(action.payload)))
        })

    case actionTypes.SET_EMAIL:
      return state.setIn(['meta', 'logIn', 'email'], action.payload)

    case actionTypes.SET_EVENT:
      return state
        .setIn(['meta', 'events', 'selected'], action.payload)
        .set('student', initialState.get('student'))
        .set('discountRegistrations', initialState.get('discountRegistrations'))

    case actionTypes.SET_PASSWORD:
      return state.setIn(['meta', 'logIn', 'password'], action.payload)

    case actionTypes.SET_STUDENT_SEARCH_STRING:
      return state
        .setIn(['meta', 'student', 'searchString'], action.payload)

    case actionTypes.UNREGISTER_DISCOUNT:
      return apiRequestReducer(state, action, 'discountRegistrations',
        (state, action, path) => {
          const index = state
            .get(path)
            .findIndex((discountRegistration) => (
              discountRegistration.get('url') === action.payload))

          if (index === -1) {
            // findIndex returns -1 when the item can't be found. This shouldn't
            // mess up our state.
            // todo: log this.
            return state
          }

          return state
            .set(path, state
              .get(path)
              .delete(index))
        })

    default:
      return state
  }
}

export {reducer}
