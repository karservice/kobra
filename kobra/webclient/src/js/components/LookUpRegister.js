import React from 'react'
import {Alert, Button, Col, Row, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import {EventSelectField, Page, Student, StudentSearchField, TicketTypes} from './'
import {
  getStudentAndDiscountRegistrations,
  setEvent
} from '../actions'
import * as selectors from '../selectors'


const mapStateToProps = (state) => ({
  studentError: selectors.getStudentError(state),
  studentIsPending: selectors.getStudentIsPending(state),
  selectedEvent: selectors.getSelectedEvent(state),
  student: selectors.getStudent(state)
})

const mapDispatchToProps = (dispatch) => ({
  handleEventSelection(domEvent) {
    dispatch(setEvent(domEvent.target.value))
  },
  dispatchSearch(searchString) {
    dispatch(getStudentAndDiscountRegistrations(searchString))
  }
})

const LookUpRegister = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchString: ''
    }

    this.setSearchString = this.setSearchString.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  setSearchString(domEvent) {
    this.setState({
      searchString: domEvent.target.value
    })
  }

  handleSubmit(domEvent) {
    this.props.dispatchSearch(this.state.searchString)
    this.setState({
      searchString: ''
    })
    domEvent.preventDefault()
  }

  render() {
    return (
      <Page title="Look up and register">
        <form onSubmit={this.handleSubmit}>
          <Row>
            <Col sm={6} smPush={6}>
              <EventSelectField />
            </Col>
            <Col sm={6} smPull={6}>
              <StudentSearchField changeHandler={this.setSearchString}
                                  value={this.state.searchString} />
            </Col>
          </Row>
          <FormGroup>
            <Button type="submit" bsStyle="primary" block
                    disabled={!this.state.searchString}>
              {this.props.studentIsPending ? 'Looking up...' : 'Look up'}
            </Button>
          </FormGroup>
        </form>

        {this.props.studentError ? (
          <Alert bsStyle="danger">
            {this.props.studentError.message}
          </Alert>
        ) : null}

        <Student>
          {this.props.selectedEvent ? (
            <TicketTypes />
          ) : null}
        </Student>
      </Page>

    )
  }
})

export {LookUpRegister}
