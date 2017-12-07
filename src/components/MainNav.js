import React from 'react'
import {MenuItem, Nav, NavDropdown, NavItem, Navbar} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import {connect} from 'react-redux'
import {IndexLink} from 'react-router'
import {IndexLinkContainer, LinkContainer} from 'react-router-bootstrap'

import * as actions from '../actions'
import * as selectors from '../selectors'

const mapStateToProps = (state) => ({
  isLoggedIn: selectors.isLoggedIn(state),
  user: selectors.getActiveUser(state)
})

const mapDispatchToProps = (dispatch) => ({
  logOut: (domEvent) => (dispatch(actions.logOut()))
})

const MainNav = connect(mapStateToProps, mapDispatchToProps, null,
  // See https://github.com/reactjs/react-redux/blob/master/docs/troubleshooting.md#my-views-arent-updating-when-something-changes-outside-of-redux
  // and https://github.com/react-bootstrap/react-router-bootstrap/issues/152
  {pure: false}
)((props) => (
  <Navbar inverse fixedTop>
    <Navbar.Header>
        <Navbar.Brand>
          <IndexLink to="/" disabled={!props.isLoggedIn}>
            Kobra
          </IndexLink>
        </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      <Nav>
        <LinkContainer to="/lookup-register/" disabled={!props.isLoggedIn}>
          <NavItem>Look up and register</NavItem>
        </LinkContainer>
        <LinkContainer to="/manage/organizations-events/" disabled={!props.isLoggedIn}>
          <NavItem>Manage organizations and events</NavItem>
        </LinkContainer>
      </Nav>
      <Nav pullRight>
        <NavDropdown title={props.user ? props.user.get('name') : 'Not logged in'} id="userMenu" disabled={!props.isLoggedIn}>
          <MenuItem onClick={props.logOut}>Log out</MenuItem>
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
))

export {MainNav}
