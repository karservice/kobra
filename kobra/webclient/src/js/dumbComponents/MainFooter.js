import React from 'react'
import {Row, Col} from 'react-bootstrap'

export const MainFooter = (props) => (
  <footer style={{fontSize: '85%'}}>
    <hr />
    <Row>
      <Col sm={4}>
        <p className="text-muted">
          Provided by <a href="http://www.karservice.se/"
                         target="_blank">Kårservice Östergötland AB</a>
        </p>
      </Col>
      <Col sm={8} />
    </Row>
  </footer>
)
