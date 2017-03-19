import React from 'react'
import {connect} from 'react-redux'
import {Col, Row, Well} from 'react-bootstrap'

import * as selectors from '../selectors'
import {UnionIndicator} from './'

const mapStateToProps = (state) => ({
  student: selectors.getStudent(state),
})

export const Student = connect(mapStateToProps)((props) => (
  !!props.student ? (
    <Well>
      <h2 className="well-heading">
        {props.student.get('name')} <small>{props.student.get('liuId')}</small>
      </h2>

      <UnionIndicator />

      {props.children}
    </Well>
  ) : (
    <div />
  )
))
