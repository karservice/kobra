import React from 'react'
import {connect} from 'react-redux'
import {Col, Row, Well} from 'react-bootstrap'
import isEmpty from 'lodash/isEmpty'

import * as selectors from '../selectors'
import {
  SectionIndicator,
  UnionIndicator
} from '../smartComponents'

const mapStateToProps = (state) => ({
  student: selectors.getStudent(state),
})

export const Student = connect(mapStateToProps)((props) => (
  !!props.student ? (
    <Well>
      <h2 className="well-heading">
        {props.student.get('name')} <small>{props.student.get('liuId')}</small>
      </h2>

      <Row>
        <Col sm={6}>
          <UnionIndicator />
        </Col>
        <Col sm={6}>
          <SectionIndicator />
        </Col>
      </Row>
      {props.children}
    </Well>
  ) : (
    <div />
  )
))
