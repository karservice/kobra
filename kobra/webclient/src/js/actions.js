import {apiAdapter, apiRequestDispatcher} from './api'
import * as selectors from './selectors'

export const actionTypes = {
  GET_DISCOUNTS: 'GET_DISCOUNTS',
  GET_DISCOUNT_REGISTRATIONS: 'GET_DISCOUNT_REGISTRATIONS',
  GET_EVENT_DISCOUNT_REGISTRATION_SUMMARY: 'GET_EVENT_DISCOUNT_REGISTRATION_SUMMARY',
  GET_EVENTS: 'GET_EVENTS',
  GET_ORGANIZATIONS: 'GET_ORGANIZATIONS',
  GET_SECTIONS: 'GET_SECTIONS',
  GET_STUDENT: 'GET_STUDENT',
  GET_TICKET_TYPES: 'GET_TICKET_TYPES',
  GET_UNIONS: 'GET_UNIONS',
  GET_USERS: 'GET_USERS',
  LOG_IN: 'LOG_IN',
  LOG_OUT: 'LOG_OUT',
  REGISTER_DISCOUNT: 'REGISTER_DISCOUNT',
  SET_EVENT: 'SET_EVENT',
  UNREGISTER_DISCOUNT: 'UNREGISTER_DISCOUNT'
}

export const getDiscounts = () => (dispatch, getState) => apiRequestDispatcher(
  actionTypes.GET_DISCOUNTS,
  apiAdapter(getState()).get('discounts/'),
  dispatch, getState
)

export const getDiscountRegistrations = () => (dispatch, getState) => {
  const state = getState()
  const studentId = selectors.getStudent(state).get('id')

  const apiRequest = apiAdapter(state)
    .get('discount-registrations/')
    .query({
      'student': studentId
    })

  return apiRequestDispatcher(
    actionTypes.GET_DISCOUNT_REGISTRATIONS, apiRequest, dispatch, getState
  )
}

export const getEvents = () => (dispatch, getState) => apiRequestDispatcher(
  actionTypes.GET_EVENTS,
  apiAdapter(getState()).get('events/'),
  dispatch, getState
)

export const getEventDiscountRegistrationSummary = (eventUrl) => (dispatch, getState) => apiRequestDispatcher(
  actionTypes.GET_EVENT_DISCOUNT_REGISTRATION_SUMMARY,
  apiAdapter(getState())
    .get('discount-registrations/summary/')
    .query({
      'event': selectors.getAllEvents(getState()).get(eventUrl).get('id')
    }),
  dispatch, getState,
  {extraMeta: {event: eventUrl}}
)

export const getOrganizations = () => (dispatch, getState) => apiRequestDispatcher(
  actionTypes.GET_ORGANIZATIONS,
  apiAdapter(getState()).get('organizations/'),
  dispatch, getState
)

export const getSections = () => (dispatch, getState) => apiRequestDispatcher(
  actionTypes.GET_SECTIONS,
  apiAdapter(getState()).get('sections/'),
  dispatch, getState
)

export const getStudent = (searchString, {successCallback=null, failureCallback=null}={}) => (dispatch, getState) => {
  // This function is a "thunk", i.e. it returns a callback taking dispatch and
  // getState. See the documentation on thunk middleware for more info.
  return apiRequestDispatcher(
    actionTypes.GET_STUDENT,
    apiAdapter(getState()).get('students/'.concat(searchString, '/')),
    dispatch, getState, {
      successCallback: successCallback, failureCallback: failureCallback
    })
}

export const getStudentAndDiscountRegistrations = (searchString) => (dispatch, getState) => {
  dispatch(getStudent(searchString, {successCallback: () => {
    dispatch(getDiscountRegistrations())
  }}))
}

export const getTicketTypes = () => (dispatch, getState) => apiRequestDispatcher(
  actionTypes.GET_TICKET_TYPES,
  apiAdapter(getState()).get('ticket-types/'),
  dispatch, getState
)

export const getUnions = () => (dispatch, getState) => apiRequestDispatcher(
  actionTypes.GET_UNIONS,
  apiAdapter(getState()).get('unions/'),
  dispatch, getState
)

export const getUsers = () => (dispatch, getState) => apiRequestDispatcher(
  actionTypes.GET_USERS,
  apiAdapter(getState()).get('users/'),
  dispatch, getState
)

export const getStaticEntities = () => (dispatch, getState) => {
  dispatch(getDiscounts())
  dispatch(getEvents())
  dispatch(getOrganizations())
  dispatch(getSections())
  dispatch(getTicketTypes())
  dispatch(getUnions())
  dispatch(getUsers())
}

export const logIn = (email, password) => (dispatch, getState) => (
  apiRequestDispatcher(
    actionTypes.LOG_IN,
    apiAdapter(getState())
      .post('auth/jwt/')
      .send({
        email: email,
        password: password
      }),
    dispatch, getState, {
      successCallback: (result) => {
        dispatch(getStaticEntities())
      }
    }
  )
)

export const logInSocial = (provider, code, redirectUri) => (dispatch, getState) => (
  apiRequestDispatcher(
    actionTypes.LOG_IN,
    apiAdapter(getState())
      .post('auth/social/jwt/')
      .send({
        provider,
        code,
        redirect_uri: redirectUri
      }),
    dispatch, getState, {
      successCallback: (result) => {
        dispatch(getStaticEntities())
      }
    }
  )
)

export const logOut = () => ({
  type: actionTypes.LOG_OUT
})

export const refreshJwt = (jwt, successCallback) => (dispatch, getState) => (
  apiRequestDispatcher(
    actionTypes.LOG_IN,
    apiAdapter(getState())
      .post('auth/jwt/refresh/')
      .send({
        token: jwt || selectors.getJwt(getState())
      }),
    dispatch, getState, {successCallback}
  )
)

export const logInUsingJwt = (jwt) => (dispatch, getState) => (
  refreshJwt(jwt, (result) => {
    dispatch(getStaticEntities())
  })(dispatch, getState)
)

export const registerDiscount = (discountUrl) => (dispatch, getState) => {
  const studentUrl = selectors.getStudent(getState()).get('url')

  apiRequestDispatcher(
    actionTypes.REGISTER_DISCOUNT,
    apiAdapter(getState())
      .post('discount-registrations/')
      .send({ student: studentUrl, discount: discountUrl }),
    dispatch, getState
  )
}

export const unregisterDiscount = (discountRegistration) => (dispatch, getState) => (
  apiRequestDispatcher(
    actionTypes.UNREGISTER_DISCOUNT,
    apiAdapter(getState())
      .delete('discount-registrations/'.concat(
        discountRegistration.get('id'), '/')),
    dispatch, getState
  )
)


export const setEvent = (value) => ({
  type: actionTypes.SET_EVENT,
  payload: value || null  // Change empty strings from HTML forms to null
})
