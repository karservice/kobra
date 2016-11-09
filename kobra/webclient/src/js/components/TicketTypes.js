import React from 'react'
import {Button, Col, Media, Row} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import {connect} from 'react-redux'
import TimeAgo from 'react-timeago'

import * as actions from '../actions'
import * as selectors from '../selectors'


const mapStateToProps = (state) => ({
  getDiscount: (discountUrl) => (selectors.getDiscount(state, discountUrl)),
  getDiscountRegistrations: (ticketType) => (
    selectors.getTicketTypeDiscountRegistrations(state, ticketType)),
  getEligibleDiscount: (ticketType) => (
    selectors.getEligibleDiscount(state, ticketType)),
  getUnion: (unionUrl) => (selectors.getUnion(state, unionUrl)),
  ticketTypes: selectors.getSelectedEventTicketTypes(state)
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

              {discountRegistrations.map((discountRegistration) => (
                <Media>
                  <Media.Body>
                    <span>{discountRegistration.get('title')}</span><br/>
                    <small className="text-muted">
                      <TimeAgo date={discountRegistration.get('timestamp')} />
                    </small>
                  </Media.Body>
                  <Media.Right>
                    <Button bsSize="small" bsStyle="danger"
                            onClick={props.handleUnregister(discountRegistration)}>
                      <FontAwesome name="remove" /> Unregister
                    </Button>
                  </Media.Right>
                </Media>
              ))}
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
