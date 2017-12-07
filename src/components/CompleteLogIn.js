import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import { logInSocial } from '../actions'
import { Page } from './'

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = (dispatch) => ({
  fetchAuthToken: (provider, code, redirectUri) => dispatch(logInSocial(provider, code, redirectUri))
})

class CompleteLogIn extends React.Component {
  componentDidMount() {
    const authProvider = this.props.params.authProvider
    const code = this.props.location.query.code
    const next = this.props.location.query.next

    let redirectUri = window.location.origin
      .concat(this.props.location.pathname)
    if (next !== undefined && next !== null) {
      redirectUri = redirectUri.concat('?next=', next)
    }

    this.props.fetchAuthToken(authProvider, code, redirectUri)
    this.props.router.push(next ? next : '/')
  }

  render() {
    return (
      <Page title="Logging in...">
        <p>Logging in... This may take a few seconds.</p>
      </Page>
    )
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CompleteLogIn))
