import React from 'react'
import {Button, ControlLabel, FormControl, FormGroup, Modal} from 'react-bootstrap'
import {connect} from 'react-redux'
import Select from 'react-select'
import 'react-select/dist/react-select.css';

import {saveOrganization} from '../actions'
import * as selectors from '../selectors'

const mapStateToProps = (state, props) => ({
  getOrganization: (url) => selectors.getAllOrganizations(state).get(url),
  userChoices: selectors.getAllUsers(state).toList().toJS().map((u) => ({
    label: `${u.name} (${u.email})`,
    value: u.url,
  })),
})

const mapDispatchToProps = (dispatch, props) => ({
  saveOrganization: (organizationId, name, adminUrls) => dispatch(saveOrganization(organizationId, name, adminUrls))
})

const OrganizationModal = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      changed: false,
      organization: null,
      name: '',
      admins: [],
    }

    this.save = this.save.bind(this)
    this.setAdmins = this.setAdmins.bind(this)
    this.setName = this.setName.bind(this)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.show && newProps.organizationUrl && newProps.organizationUrl !== this.props.organizationUrl) {
      const organization = this.props.getOrganization(newProps.organizationUrl)
      const adminUrls = organization.get('admins')

      this.setState({
        changed: false,
        organization: organization,
        name: organization.get('name'),
        admins: this.props.userChoices.filter((uc) => (adminUrls.includes(uc.value))),
      })
    }
  }

  setAdmins(value) {
    this.setState({
      changed: true,
      admins: value,
    })
  }

  setName(domEvent) {
    this.setState({
      changed: true,
      name: domEvent.target.value,
    })
  }

  stateIsValid() {
    return (
      this.state.name &&
      this.state.admins.length > 0
    )
  }

  save(domEvent) {
    this.props.saveOrganization(this.state.organization.get('id'), this.state.name, this.state.admins.map((a) => (a.value)))
    this.props.onHide()
    domEvent.preventDefault()
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{this.state.organization ? this.state.organization.get('name') : ''}</Modal.Title>
        </Modal.Header>
        <form onSubmit={this.save}>
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Name</ControlLabel>
              <FormControl type="text" value={this.state.name} onChange={this.setName}/>
            </FormGroup>
            <FormGroup>
              <ControlLabel>Administrators</ControlLabel>
              <Select multi value={this.state.admins} options={this.props.userChoices} onChange={this.setAdmins}/>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" bsStyle="primary" disabled={!this.state.changed || !this.stateIsValid()}>Save</Button>
          </Modal.Footer>
        </form>
      </Modal>
    )
  }
})

export {OrganizationModal}
