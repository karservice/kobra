import React from 'react'
import {ControlLabel, FormControl, FormGroup, HelpBlock} from 'react-bootstrap'
import {connect} from 'react-redux'

import * as actions from '../actions'
import * as selectors from '../selectors'

const mapStateToProps = (state) => ({
  getOrganizationEvents: (organizationUrl) => (
    selectors.getOrganizationEvents(state, organizationUrl)
  ),
  organizations: selectors.getAllOrganizations(state),
  selectedEventUrl: selectors.getSelectedEventUrl(state)
})

const mapDispatchToProps = (dispatch) => ({
  changeHandler: (domEvent) => (
    dispatch(actions.setEvent(domEvent.target.value)))
})

const EventSelectField = connect(mapStateToProps, mapDispatchToProps)(
  (props) => (
    <FormGroup>
      <ControlLabel>Event</ControlLabel>
      <FormControl componentClass="select" placeholder="Event"
                   value={props.selectedEventUrl || ''}
                   onChange={props.changeHandler}>
        <option value="">&mdash;</option>
        {props.organizations.map(organization => (
          <optgroup label={organization.get('name')}
                    key={organization.get('url')}>
            {props.getOrganizationEvents(organization.get('url'))
              .map((event) => (
                <option value={event.get('url')} key={event.get('url')}>
                  {event.get('name')}
                </option>
              ))
            }
          </optgroup>
        ))}
      </FormControl>
      <HelpBlock>
        Leave empty to only look up students.
      </HelpBlock>
      <FormControl.Feedback />
    </FormGroup>
  )
)

export {EventSelectField}
