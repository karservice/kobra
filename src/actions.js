import {fetchAction} from './api'
import {apiRoot} from './settings'
import * as selectors from './selectors'

export const actionTypes = {
  GET_DISCOUNTS: 'GET_DISCOUNTS',
  GET_DISCOUNT_REGISTRATIONS: 'GET_DISCOUNT_REGISTRATIONS',
  GET_EVENT_DISCOUNT_REGISTRATION_SUMMARY: 'GET_EVENT_DISCOUNT_REGISTRATION_SUMMARY',
  GET_EVENTS: 'GET_EVENTS',
  GET_ORGANIZATIONS: 'GET_ORGANIZATIONS',
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

export const getDiscounts = () => fetchAction({
  actionType: actionTypes.GET_DISCOUNTS,
  url: `${apiRoot}discounts/`,
  useAuth: true
})

export const getDiscountRegistrations = () => (dispatch, getState) => {
  const studentId = selectors.getStudent(getState()).get('id')

  return fetchAction({
    actionType: actionTypes.GET_DISCOUNT_REGISTRATIONS,
    url: `${apiRoot}discount-registrations/?student=${studentId}`,
    useAuth: true
  })(dispatch, getState)
}

export const getEvents = () => fetchAction({
  actionType: actionTypes.GET_EVENTS,
  url: `${apiRoot}events/`,
  useAuth: true
})

export const getEventDiscountRegistrationSummary = (eventUrl) => (dispatch, getState) => {
  const eventId = selectors.getAllEvents(getState()).get(eventUrl).get('id')

  return fetchAction({
    actionType: actionTypes.GET_EVENT_DISCOUNT_REGISTRATION_SUMMARY,
    url: `${apiRoot}discount-registrations/summary/?event=${eventId}`,
    extraMeta: {event: eventUrl},
    useAuth: true,
  })(dispatch, getState)
}

export const getOrganizations = () => fetchAction({
  actionType: actionTypes.GET_ORGANIZATIONS,
  url: `${apiRoot}organizations/`,
  useAuth: true,
})

export const getStudent = (searchString, successCallback) => fetchAction({
  actionType: actionTypes.GET_STUDENT,
  url: `${apiRoot}students/${searchString}/`,
  useAuth: true,
  extraSuccessCallback: successCallback,
})

export const getStudentAndDiscountRegistrations = (searchString) => (dispatch, getState) => {
  dispatch(getStudent(searchString, () => {
    dispatch(getDiscountRegistrations())
  }))
}

export const getTicketTypes = () => fetchAction({
  actionType: actionTypes.GET_TICKET_TYPES,
  url: `${apiRoot}ticket-types/`,
  useAuth: true,
})

export const getUnions = () => fetchAction({
  actionType: actionTypes.GET_UNIONS,
  url: `${apiRoot}unions/`,
  useAuth: true,
})

export const getUsers = () => fetchAction({
  actionType: actionTypes.GET_USERS,
  url: `${apiRoot}users/`,
  useAuth: true,
})

export const getStaticEntities = () => (dispatch, getState) => {
  dispatch(getDiscounts())
  dispatch(getEvents())
  dispatch(getOrganizations())
  dispatch(getTicketTypes())
  dispatch(getUnions())
  dispatch(getUsers())
}

export const logIn = (email, password) => (dispatch, getState) => fetchAction({
  actionType: actionTypes.LOG_IN,
  url: `${apiRoot}auth/jwt/`,
  options: {
    method: 'POST',
    body: JSON.stringify({
      email,
      password
    })
  },
  extraSuccessCallback: (payload) => {
    dispatch(getStaticEntities())
  }
})(dispatch, getState)

export const logInSocial = (provider, code, redirectUri) => (dispatch, getState) => fetchAction({
  actionType: actionTypes.LOG_IN,
  url: `${apiRoot}auth/social/jwt/`,
  options: {
    method: 'POST',
    body: JSON.stringify({
      provider,
      code,
      redirect_uri: redirectUri
    })
  },
  extraSuccessCallback: (payload) => {
    dispatch(getStaticEntities())
  }
})(dispatch, getState)

export const logOut = () => ({
  type: actionTypes.LOG_OUT
})

export const refreshJwt = (jwt, successCallback) => (dispatch, getState) => fetchAction({
  actionType: actionTypes.LOG_IN,
  url: `${apiRoot}auth/jwt/refresh/`,
  options: {
    method: 'POST',
    body: JSON.stringify({
      token: jwt || selectors.getJwt(getState())
    })
  },
  extraSuccessCallback: successCallback
})(dispatch, getState)

export const logInUsingJwt = (jwt) => (dispatch, getState) => (
  refreshJwt(jwt, (result) => {
    dispatch(getStaticEntities())
  })(dispatch, getState)
)

export const registerDiscount = (discountUrl) => (dispatch, getState) => {
  const studentUrl = selectors.getStudent(getState()).get('url')

  return fetchAction({
    actionType: actionTypes.REGISTER_DISCOUNT,
    url: `${apiRoot}discount-registrations/`,
    options: {
      method: 'POST',
      body: JSON.stringify({
        student: studentUrl,
        discount: discountUrl,
      }),
    },
    useAuth: true,
  })(dispatch, getState)
}

export const unregisterDiscount = (discountRegistration) => fetchAction({
  actionType: actionTypes.UNREGISTER_DISCOUNT,
  url: `${apiRoot}discount-registrations/${discountRegistration.get('id')}/`,
  options: {
    method: 'DELETE',
  },
  extraMeta: {
    discountRegistrationUrl: discountRegistration.get('url'),
  },
  useAuth: true,
})



export const setEvent = (value) => ({
  type: actionTypes.SET_EVENT,
  payload: value || null  // Change empty strings from HTML forms to null
})
