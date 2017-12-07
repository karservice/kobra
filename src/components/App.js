import React from 'react'
import {Button, Col, FormGroup, Grid, Row, Popover, OverlayTrigger} from 'react-bootstrap'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'

import {LogInForm, MainFooter, MainNav, Page} from './'
import * as settings from '../settings'
import {isLoggedIn, logInIsPending} from '../selectors'

const mapStateToProps = (state) => ({
  isLoggedIn: isLoggedIn(state),
  isPending: logInIsPending(state)
})

const App = withRouter(connect(mapStateToProps)((props) => {
  const liuLogInHref = `https://${settings.liuAdfsHost}/adfs/oauth2/authorize?response_type=code&redirect_uri=${encodeURIComponent(window.location.origin)}%2Flog-in%2Fliu%2F%3Fnext%3D${encodeURIComponent(props.location.pathname)}&client_id=${settings.liuAdfsClientId}&resource=https%3A%2F%2Fkobra.karservice.se`
  const localLogInPopover = (
    <Popover id="local-log-in-popover">
      <LogInForm/>
    </Popover>
  )
  return (
    <div>
      <MainNav />
      {props.isLoggedIn ? (
        props.children
      ) : (
        <Page title="Log in">
          <Row>
            <Col sm={6}>
              <p className="lead">
                Kobra is a tool for looking up union and section membership of
                LiU students and for registrering union discounts.
              </p>
              <p>
                Access to Kobra is granted by the student union office.
              </p>
            </Col>
            <Col sm={6}>
              <FormGroup>

                <Button type="button" block bsStyle="primary" bsSize="lg"
                        href={liuLogInHref}>
                  {props.isPending ? (
                    <span>Logging in...</span>
                  ) : (
                    <span>Log in with LiU ID</span>
                  )}
                </Button>
              </FormGroup>
              <FormGroup>
                <OverlayTrigger trigger="click" rootClose placement="bottom"
                                overlay={localLogInPopover}>
                  <Button type="button" block bsStyle="default" bsSize="lg">
                    Log in with local account
                  </Button>
                </OverlayTrigger>
              </FormGroup>
            </Col>
          </Row>
        </Page>
      )}
      <Grid>
        <MainFooter />
      </Grid>
    </div>
  )
}))

export {App}
