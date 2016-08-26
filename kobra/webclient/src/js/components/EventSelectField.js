import React from 'react'
import {ControlLabel, FormControl, FormGroup, HelpBlock} from 'react-bootstrap'
import {connect} from 'react-redux'

import * as actions from '../actions'
import * as selectors from '../selectors'

const mapStateToProps = (state) => ({
  getEventsForOrganization: (organization) => (
    selectors.getEvents(state).filter((event) => (
      event.get('organization') === organization.get('url')))),
  organizations: selectors.getOrganizations(state),
  selectedEvent: selectors.getSelectedEvent(state)
})

const mapDispatchToProps = (dispatch) => ({
  changeHandler: (domEvent) => (
    dispatch(actions.setEvent(domEvent.target.value)))
})

const EventSelectField = connect(mapStateToProps, mapDispatchToProps)(
  (props) => {
    const selectedEventUrl = (props.selectedEvent === null) ?
      '' : props.selectedEvent.get('url')

    return (
      <FormGroup>
        <ControlLabel>Event</ControlLabel>
        <FormControl componentClass="select" placeholder="Event"
                     value={selectedEventUrl} onChange={props.changeHandler}>
          <option value="">&mdash;</option>
          {props.organizations.map(organization => (
            <optgroup label={organization.get('name')}
                      key={organization.get('id')}>
              {props.getEventsForOrganization(organization)
                .map((event) => (
                  <option value={event.get('url')} key={event.get('id')}>
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
  }
)

EventSelectField.propTypes = {
  changeHandler: React.PropTypes.func
}

export {EventSelectField}
