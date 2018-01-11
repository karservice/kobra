import React from 'react'
import {Button, ButtonToolbar, Media} from 'react-bootstrap'
import {connect} from 'react-redux'

import {EventDiscountSummaryModal, OrganizationModal, Page} from './'
import * as selectors from '../selectors'

const mapStateToProps = (state) => ({
  events: selectors.getAllEvents(state),
  organizations: selectors.getAllOrganizations(state)
})

const ManageOrganizationsEvents = connect(mapStateToProps)(class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      action: null,
      entityUrl: null
    }

    this.close = this.close.bind(this)
    this.editOrganization = this.editOrganization.bind(this)
    this.viewEventDiscountSummary = this.viewEventDiscountSummary.bind(this)
  }

  close() {
    return (domEvent) => {
      this.setState({
        action: null,
        entityUrl: null
      })
    }
  }

  editOrganization(organizationUrl) {
    return (domEvent) => {
      this.setState({
        action: 'editOrganization',
        entityUrl: organizationUrl
      })
    }
  }

  viewEventDiscountSummary(eventUrl) {
    return (domEvent) => {
      this.setState({
        action: 'viewEventDiscountSummary',
        entityUrl: eventUrl
      })
    }
  }

  render() {
    return (
      <Page title="Manage organizations and events">
        {this.props.organizations.map((organization) => {
          const organizationEvents = this.props.events.filter((event) => (event.get('organization') === organization.get('url')))
          return (
            <div>
              <h1>
                {organization.get('name')}
              </h1>
              <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.editOrganization(organization.get('url'))}>Edit organization</Button>
              </ButtonToolbar>
              {organizationEvents.map((event) => (
                <Media>
                  <Media.Body>
                    <Media.Heading>{event.get('name')}</Media.Heading>
                    <ButtonToolbar>
                      <Button bsStyle="info" onClick={this.viewEventDiscountSummary(event.get('url'))}>View discount summary</Button>
                    </ButtonToolbar>
                  </Media.Body>
                </Media>
              ))}
            </div>
          )
        })}
        <EventDiscountSummaryModal show={this.state.action === 'viewEventDiscountSummary'} eventUrl={this.state.entityUrl} onHide={() => this.setState({action: null, entityUrl: null})}/>
        <OrganizationModal show={this.state.action === 'editOrganization'} organizationUrl={this.state.entityUrl} onHide={this.close()}/>
      </Page>
    )
  }
})

export {ManageOrganizationsEvents}
