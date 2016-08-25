import React from 'react'
import {findDOMNode} from 'react-dom'
import {ControlLabel, FormControl, FormGroup, HelpBlock} from 'react-bootstrap'

const keys = /^[a-z0-9]$/
// keyIdentifier represents a *key* and not a *character*. Therefore these are
// Unicode IDs for numbers and uppercase letters.
const keyIdentifiers = /^U\+00(3[0-9]|4[1-9A-F]|5[0-9A])$/

export const StudentSearchField = React.createClass({
  handleKeyDown: function (event) {
    if (
      (
        // If this field is active already, we ignore this event.
        window.document.activeElement !== this.inputField
      ) && (
        // If any modifier key is used, we ignore this event.
        !(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      ) && (
        // Some browsers haven't managed to take step into the modern ages and
        // still use the non-standardized way of keyIdentifiers, so we must
        // check for both.
        // (It's Safari.) ((Even IE 9 does it right.)) (((Yuck.)))
        keys.test(event.key) || keyIdentifiers.test(event.keyIdentifier)
      )
    ) {
      this.inputField.focus()
    }
  },

  createRefToInputField: function (ref) {
    this.inputField = findDOMNode(ref)
  },

  componentDidMount: function () {
    window.addEventListener('keydown', this.handleKeyDown)
  },

  componentWillUnmount: function () {
    window.removeEventListener('keydown', this.handleKeyDown)
  },

  render: function () {
    return (
      <FormGroup>
        <ControlLabel>Student identifier</ControlLabel>
        <FormControl type="text" placeholder="Student identifier"
                     value={this.props.value} disabled={this.props.disabled}
                     onChange={this.props.changeHandler}
                     ref={this.createRefToInputField} />
        <HelpBlock>
          Student's LiU ID or card number.
        </HelpBlock>
      </FormGroup>
    )
  }
})

StudentSearchField.propTypes = {
  changeHandler: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool,
  value: React.PropTypes.string.isRequired
}
