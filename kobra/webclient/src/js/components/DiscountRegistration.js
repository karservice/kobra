import React from 'react'

import {
  Button,
  Media
} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import TimeAgo from 'react-timeago'

const DiscountRegistration = (props) => (
  <Media>
    <Media.Body>
      <span>{props.title}</span><br/>
      <small className="text-muted"><TimeAgo date={props.timestamp} /></small>
    </Media.Body>
    <Media.Right>
      <Button bsSize="small" bsStyle="danger"
              onClick={() => props.unregisterHandler(props.url)}>
        <FontAwesome name="remove" /> Unregister
      </Button>
    </Media.Right>
  </Media>
)

export {DiscountRegistration}
