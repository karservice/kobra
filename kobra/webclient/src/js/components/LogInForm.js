import React from 'react'
import {Alert, Button, ControlLabel, FormControl, FormGroup} from 'react-bootstrap'
import {connect} from 'react-redux'

import {logIn} from '../actions'
import * as selectors from '../selectors'

const mapStateToProps = (state) => ({
  isPending: selectors.logInIsPending(state),
  logInError: selectors.getLogInError(state)
})

const mapDispatchToProps = (dispatch) => ({
  dispatchLogIn: (email, password) => {
    dispatch(logIn(email, password))
  }
})

const LogInForm = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }

    this.setEmail = this.setEmail.bind(this)
    this.setPassword = this.setPassword.bind(this)
    this.logIn = this.logIn.bind(this)
  }

  setEmail(domEvent) {
    this.setState({
      email: domEvent.target.value
    })
  }

  setPassword(domEvent) {
    this.setState({
      password: domEvent.target.value
    })
  }

  logIn(domEvent) {
    this.props.dispatchLogIn(this.state.email, this.state.password)
    domEvent.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.logIn}>
        <FormGroup bsSize="lg">
          <ControlLabel>Email address</ControlLabel>
          <FormControl type="email" placeholder="Email address" value={this.state.email}
                       onChange={this.setEmail} />
          <FormControl.Feedback />
        </FormGroup>
        <FormGroup bsSize="lg">
          <ControlLabel>Password</ControlLabel>
          <FormControl type="password" placeholder="Password" value={this.state.password}
                       onChange={this.setPassword} />
          <FormControl.Feedback />
        </FormGroup>
        <FormGroup>
          <Button type="submit" block bsStyle="primary" bsSize="lg"
                  disabled={this.props.isPending}>
            {this.props.isPending ? (
              <span>Logging in...</span>
            ) : (
              <span>Log in</span>
            )}
          </Button>
        </FormGroup>
        {!this.props.logInError ? (
          <div />
        ) : (
          <Alert bsStyle="danger">
            {this.props.logInError.message}
          </Alert>
        )}
      </form>
    )
  }
})

export {LogInForm}
