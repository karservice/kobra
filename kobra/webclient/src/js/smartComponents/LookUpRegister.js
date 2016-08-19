import React from 'react'
import {Alert, Button, Col, Row, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import {
  getStudentAndDiscountRegistrations,
  setEvent,
  setStudentSearchString
} from '../actions'
import {
  EventSelectField,
  Student,
  StudentSearchField
} from '../dumbComponents'
import * as selectors from '../selectors'
import {TicketTypes} from './'


const mapStateToProps = (state) => ({
  studentError: selectors.getStudentError(state),
  studentIsPending: selectors.getStudentIsPending(state),
  selectedEvent: selectors.getSelectedEvent(state),
  student: selectors.getStudent(state),
  searchString: selectors.getStudentSearchString(state)
})

const mapDispatchToProps = (dispatch) => ({
  handleEventSelection(domEvent) {
    dispatch(setEvent(domEvent.target.value))
  },
  handleSearchStringChange(domEvent) {
    dispatch(setStudentSearchString(domEvent.target.value))
  },
  handleSubmit(domEvent) {
    dispatch(getStudentAndDiscountRegistrations())
    domEvent.preventDefault()
  }
})

const RegisterDiscountsComponent = (props) => {
  return (
    <div>
      <form onSubmit={props.handleSubmit}>
        <Row>
          <Col sm={6} smPush={6}>
            <EventSelectField />
          </Col>
          <Col sm={6} smPull={6}>
            <StudentSearchField changeHandler={props.handleSearchStringChange}
                                value={props.searchString} />
          </Col>
        </Row>
        <FormGroup>
          <Button type="submit" bsStyle="primary" block
                  disabled={!props.searchString}>
            {props.studentIsPending ? 'Looking up...' : 'Look up'}
          </Button>
        </FormGroup>
      </form>

      {!props.studentError ? (
        <div />
      ) : (
        <Alert bsStyle="danger">
          {props.studentError.message}
        </Alert>
      )}

      <Student>
        {!!props.selectedEvent ? (
          <TicketTypes />
        ) : (
          <p />
        )}
      </Student>

    </div>
  )
}

export const LookUpRegister = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterDiscountsComponent)
