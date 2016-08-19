import {List} from 'immutable'

import {intersection} from './utils'

export const isLoggedIn = (state) => (
  getJwt(state) !== null
)

export const getDiscounts = (state) => (
  state.get('discounts')
)

export const getDiscount = (state, discountUrl) => (
  getDiscounts(state).find((discount) => (
    discount.get('url') === discountUrl
  ))
)

export const getDiscountRegistrations = (state) => (
  state.get('discountRegistrations')
)

export const getEvents = (state) => (
  state.get('events')
)

export const getEventsMeta = (state) => (
  state.getIn(['meta', 'events'])
)

export const getEmail = (state) => (
  state.getIn(['meta', 'logIn', 'email'])
)

export const getLogInError = (state) => (
  state.getIn(['meta', 'logIn', 'error'])
)

export const getJwt = (state) => (
  state.get('jwt')
)

export const getOrganizations = (state) => (
  state.get('organizations')
)

export const getPassword = (state) => (
  state.getIn(['meta', 'logIn', 'password'])
)

export const getSections = (state) => (
  state.get('sections')
)

export const getSection = (state, ref) => {
  switch (ref) {
    case null:
    case undefined:
      return ref
    default:
      return getSections(state)
        .find((s) => (s.get('url') === ref))
  }
}

export const getSelectedEvent = (state) => {
  const url = state.getIn(['meta', 'events', 'selected'])

  if (url === null) {
    return null
  }

  return getEvents(state)
    .find((event) => (event.get('url') === url))
}

export const getStudent = (state) => (
  state.get('student')
)

export const getStudentError = (state) => (
  state.getIn(['meta', 'student', 'error'])
)

export const getStudentIsPending = (state) => (
  state.getIn(['meta', 'student', 'isPending'])
)

export const getStudentSearchString = (state) => (
  state.getIn(['meta', 'student', 'searchString'])
)

export const getStudentsSection = (state) => (
  getSection(state, getStudent(state).get('section'))
)

export const getStudentsUnion = (state) => (
  getUnion(state, getStudent(state).get('union'))
)

export const getTicketTypes = (state) => (
  state.get('ticketTypes')
)

export const getUnions = (state) => (
  state.get('unions')
)

export const getUnion = (state, ref) => {
  switch (ref) {
    case null:
    case undefined:
      return ref
    default:
      return getUnions(state)
        .find((u) => (u.get('url') === ref))
  }
}

export const getTicketTypeDiscounts = (state, ticketType) => (
  getDiscounts(state).filter((discount) => (
    discount.get('ticketType') === ticketType.get('url')
  ))
)

export const getTicketTypeDiscountRegistrations = (state, ticketType) => (
  getDiscountRegistrations(state)
    .filter(intersection(getTicketTypeDiscounts(state, ticketType),
      (discountRegistration, discount) => (
        discountRegistration.get('discount') === discount.get('url')
      )))
)

export const getEligibleDiscount = (state, ticketType) => (
  getTicketTypeDiscounts(state, ticketType).find((discount) => (
    discount.get('union') === getStudent(state).get('union')
  ))
)

export const getTicketTypesForSelectedEvent = (state) => {
  const selectedEvent = getSelectedEvent(state)

  if (selectedEvent === null) {
    return List()
  }

  return getTicketTypes(state)
    .filter((ticketType) => (
      ticketType.get('event') === selectedEvent.get('url')
    ))
}

export const getUser = (state) => (
  state.get('user')
)

export const logInIsPending = (state) => (
  state.getIn(['meta', 'logIn', 'isPending'])
)
