import React from 'react'
import {Col, Grid, Navbar, Row, Well} from 'react-bootstrap'
import {connect} from 'react-redux'

import {MainFooter, MainNav} from '../dumbComponents'
import {LogInForm} from './'
import {isLoggedIn} from '../selectors'

const mapStateToProps = (state) => ({
  isLoggedIn: isLoggedIn(state)
})

export const App = connect(mapStateToProps)((props) => (
  <div>
    <MainNav />
    {(!props.isLoggedIn || props.children.props.route.title) ? (
      <Navbar staticTop>
        <Navbar.Header>
          <Navbar.Brand>
            {props.isLoggedIn ? (
              props.children.props.route.title
            ) : (
              'Log in'
            )}
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    ) : (
      // p element to give natural top margin.
      <p />
    )}

  <Grid>
    {props.isLoggedIn ? (
      props.children
    ) : (
      <Row>
        <Col sm={6}>
          <p className="lead">
            Kobra is a tool for looking up union and section membership of LiU
            students and for registrering union discounts.
          </p>
          <p>
            Access to Kobra is granted by the student union office.
          </p>
        </Col>
        <Col sm={6}>
          <LogInForm />
        </Col>
      </Row>
    )}
    <MainFooter />
  </Grid>
    </div>
))
