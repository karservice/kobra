import {List} from 'immutable'

import {intersection} from './utils'

const isNotMeta = (value, key) => !key.startsWith('_')

export const isLoggedIn = (state) => (
  getJwt(state) !== null
)

export const getAllDiscounts = (state) => (
  state
    .get('discounts')
    .filter(isNotMeta)
)

export const getAllDiscountRegistrations = (state) => (
  state
    .get('discountRegistrations')
    .filter(isNotMeta)
    .map((discountRegistration) => {
      const discount = getDiscount(state, discountRegistration.get('discount'))
      const union = getUnion(state, discount.get('union'))

      return discountRegistration.set('title', ''.concat(
        union.get('name'), ': ', discount.get('amount'), ' kr'
      ))
    })
)

export const getAllEvents = (state) => (
  state.get('events').filter(isNotMeta)
)

export const getAllOrganizations = (state) => (
  state.get('organizations').filter(isNotMeta)
)

export const getAllSections = (state) => (
  state.get('sections').filter(isNotMeta)
)

export const getAllTicketTypes = (state) => (
  state.get('ticketTypes').filter(isNotMeta)
)

export const getAllUnions = (state) => (
  state.get('unions').filter(isNotMeta)
)

export const getAllUsers = (state) => (
  state.get('users').filter(isNotMeta)
)

export const getDiscount = (state, discountUrl) => (
  getAllDiscounts(state).get(discountUrl)
)

export const getEventDiscountRegistrationSummary = (state, eventUrl) => (
  state.getIn(['eventDiscountRegistrationSummaries', eventUrl])
)

export const getEventTicketTypes = (state, eventUrl) => (
  getAllTicketTypes(state).filter((t) => (t.get('event') === eventUrl))
)

export const getEventWithId = (state, eventId) => (
  getAllEvents(state).find((e) => (e.get('id') === eventId))
)

export const getLogInError = (state) => (
  state.getIn(['auth', '_error'])
)

export const getOrganizationWithId = (state, organizationId) => (
  getAllOrganizations(state).find((o) => (o.get('id') === organizationId))
)

export const getOrganizationEvents = (state, organizationUrl) => (
  getAllEvents(state).filter((e) => (e.get('organization') === organizationUrl))
)

export const getJwt = (state) => (
  state.getIn(['auth', 'jwt'])
)

export const getSection = (state, ref) => {
  switch (ref) {
    case null:
    case undefined:
      return ref
    default:
      return getAllSections(state).get(ref)
  }
}

export const getSelectedEventUrl = (state) => (
  state.getIn(['events', '_active'])
)

export const getSelectedEvent = (state) => (
  getAllEvents(state).get(getSelectedEventUrl(state))
)

export const getStudent = (state) => (
  state.getIn(['students', state.getIn(['students', '_active'])])
)

export const getStudentError = (state) => (
  state.getIn(['students', '_error'])
)

export const getStudentIsPending = (state) => (
  state.getIn(['students', '_isPending'])
)

export const getStudentsSection = (state) => (
  getSection(state, getStudent(state).get('section'))
)

export const getStudentsUnion = (state) => (
  getUnion(state, getStudent(state).get('union'))
)

export const getUnion = (state, ref) => {
  switch (ref) {
    case null:
    case undefined:
      return ref
    default:
      return getAllUnions(state).get(ref)
  }
}

export const getTicketTypeDiscounts = (state, ticketTypeUrl) => (
  getAllDiscounts(state).filter((d) => (
    d.get('ticketType') === ticketTypeUrl
  ))
)

export const getTicketTypeDiscountRegistrations = (state, ticketType) => (
  getAllDiscountRegistrations(state)
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

export const getSelectedEventTicketTypes = (state) => (
  getAllTicketTypes(state)
    .filter((ticketType) => (
      ticketType.get('event') === state.getIn(['events', '_active'])
    ))
)

export const getActiveUser = (state) => {
  const activeUserUrl = state.getIn(['users', '_active'])
  return !!activeUserUrl ? state.getIn(['users', activeUserUrl]) : null
}

export const logInIsPending = (state) => (
  state.getIn(['auth', '_isPending'])
)
