import React from 'react'
import {Map} from 'immutable'
import {Modal, Table} from 'react-bootstrap'
import {connect} from 'react-redux'
import formatDate from 'dateformat'

import * as actions from '../actions'
import * as selectors from '../selectors'

const mapStateToProps = (state, props) => {
  const unions = selectors.getAllUnions(state)
  const ticketTypesTree = selectors.getEventTicketTypes(state, props.eventUrl)
    .map((ticketType) => (
      ticketType.set('discounts', selectors.getTicketTypeDiscounts(state, ticketType.get('url')).map((discount) => (discount.set('union', unions.get(discount.get('union'))))))
    ))

  return ({
    event: selectors.getAllEvents(state).get(props.eventUrl, Map()),
    ticketTypesTree: ticketTypesTree,
    unions: selectors.getAllUnions(state),
    eventDiscountRegistrationSummary: selectors.getEventDiscountRegistrationSummary(state, props.eventUrl)
  })
}

const mapDispatchToProps = (dispatch, props) => ({
  getEventDiscountRegistrationSummary: (eventUrl) => dispatch(actions.getEventDiscountRegistrationSummary(eventUrl))
})

const EventDiscountSummaryModal = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {
  componentWillReceiveProps(newProps) {
    if (newProps.show && newProps.eventUrl && newProps.eventUrl !== this.props.eventUrl) {
      this.props.getEventDiscountRegistrationSummary(newProps.eventUrl)
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} bsSize="lg">
        <Modal.Header closeButton>
          <Modal.Title>Event discount summary <small>{this.props.event.get('name')}</small></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped condensed responsive>
            <thead>
            <tr>
              <th rowSpan="2"/>
              {this.props.ticketTypesTree.map((ticketType, key) => (
                <th key={key} colSpan={ticketType.get('discounts').size + 1}>
                  {ticketType.get('name')}
                </th>
              ))}
            </tr>
            <tr>
              {this.props.ticketTypesTree.map((ticketType) => (
                // Wrapping these in a <div> won't work, so we return an array
                // instead
                [
                  ticketType.get('discounts').map((discount, key) => (
                    <th align="right" key={key}>{discount.getIn(['union', 'name'])}</th>
                  )),
                  <th align="right">Total</th>
                ]
              ))}
            </tr>
            </thead>
            <tbody>
            {this.props.eventDiscountRegistrationSummary ? (
              this.props.eventDiscountRegistrationSummary.map((row, key) => (
                  <tr key={key}>
                    <td>
                      {
                        formatDate(new Date(row.get('timespan')), 'yyyy-mm-dd HH:MM:ss')
                      }
                    </td>
                    {this.props.ticketTypesTree.map((ticketType) => (
                      // Wrapping these in a <div> won't work, so we return an
                      // array instead
                      [
                        ticketType.get('discounts').map((discount, key) => {
                          return (
                            <td key={key}>
                              {row.get('discountRegistrations')
                                .find((d) => d.get('discount') === discount.get('url'), null, Map())
                                .get('count', '-')  // - is more distinguishable than 0
                              }
                            </td>
                          )
                        }),
                        <td className="bg-info">
                          {row.get('discountRegistrations')
                            .filter((d) => (
                              ticketType.get('discounts').some((discount) => (
                                d.get('discount') === discount.get('url')
                              ))
                            ))
                            .reduce((sum, d) => sum + d.get('count'), 0) || '-'
                            // - is more distinguishable than 0
                          }
                        </td>
                      ]
                    ))}
                  </tr>
                )
              )
            ) : null}
            </tbody>
            <tfoot>
            <tr>
              <td>Total</td>
              {this.props.ticketTypesTree.map((ticketType) => (
                // Wrapping these in a <div> won't work, so we return an
                // array instead
                [
                  ticketType.get('discounts').map((discount, key) => {
                    return (
                      <td key={key}>
                        {
                          this.props.eventDiscountRegistrationSummary ? (
                            this.props.eventDiscountRegistrationSummary
                              .map((row) => (row.get('discountRegistrations')))
                              .flatten(true)
                              .filter((d) => (d.get('discount') === discount.get('url')))
                              .reduce((sum, d) => (sum + d.get('count')), 0) || '-'
                          ) : null
                        }
                      </td>
                    )
                  }),
                  <td className="bg-info">
                    {
                      this.props.eventDiscountRegistrationSummary ? (
                        this.props.eventDiscountRegistrationSummary
                          .map((row) => (row.get('discountRegistrations')))
                          .flatten(true)
                          .filter((d) => (
                            ticketType.get('discounts').some((discount) => (
                              d.get('discount') === discount.get('url')
                            ))
                          ))
                          .reduce((sum, d) => sum + d.get('count'), 0) || '-'
                      ) : null
                    }
                  </td>
                ]
              ))}
            </tr>
            </tfoot>
          </Table>
        </Modal.Body>
      </Modal>
    )
  }
})

export {EventDiscountSummaryModal}
