import React from 'react'
import {Button, Col, Row} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import {connect} from 'react-redux'

import {DiscountRegistration} from './'
import * as actions from '../actions'
import * as selectors from '../selectors'


const mapStateToProps = (state) => ({
  getDiscount: (discountUrl) => (selectors.getDiscount(state, discountUrl)),
  getDiscountRegistrations: (ticketType) => (
    selectors.getTicketTypeDiscountRegistrations(state, ticketType)),
  getEligibleDiscount: (ticketType) => (
    selectors.getEligibleDiscount(state, ticketType)),
  getUnion: (unionUrl) => (selectors.getUnion(state, unionUrl)),
  ticketTypes: selectors.getTicketTypesForSelectedEvent(state)
})

const mapDispatchToProps = (dispatch) => ({
  handleRegister: (discountUrl) => (domEvent) => (
    dispatch(actions.registerDiscount(discountUrl))),
  handleUnregister: (discountRegistration) => (domEvent) => (
    dispatch(actions.unregisterDiscount(discountRegistration))
  )
})

const TicketTypes = connect(mapStateToProps, mapDispatchToProps)((props) => (
  !props.ticketTypes.isEmpty() ? (
    <Row>
      {props.ticketTypes
        .map((ticketType) => {
          const discountRegistrations = props.getDiscountRegistrations(ticketType)
          const eligibleDiscount = props.getEligibleDiscount(ticketType)

          return (
            <Col key={ticketType.get('id')} sm={6}>
              <h4>{ticketType.get('name')}</h4>
              <Button bsSize="lg" bsStyle="primary" block
                      disabled={!eligibleDiscount}
                      onClick={!!eligibleDiscount ? props.handleRegister(eligibleDiscount.get('url')) : null}>
                <FontAwesome name="check"/> Register
              </Button>


              {discountRegistrations
                .map((discountRegistration) => {
                  const discount = props.getDiscount(
                    discountRegistration.get('discount'))
                  const union = props.getUnion(discount.get('union'))
                  const title = ''.concat(
                    union.get('name'),
                    ': ',
                    discount.get('amount'),
                    ' kr'
                  )

                  return (
                    <DiscountRegistration
                      key={discountRegistration.get('id')} title={title}
                      timestamp={discountRegistration.get('timestamp')}
                      url={discountRegistration.get('url')}
                      unregisterHandler={props.handleUnregister(
                        discountRegistration)} />
                  )
                })
              }
            </Col>
          )
        })
      }
    </Row>
  ) : (
    <p>This event has no ticket types.</p>
  )
))

export {TicketTypes}
