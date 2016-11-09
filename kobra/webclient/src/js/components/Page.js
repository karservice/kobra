import React from 'react'
import {Grid, Navbar} from 'react-bootstrap'

const Page = (props) => (
  <div>
    {props.title ? (
      <Navbar staticTop>
        <Navbar.Header>
          <Navbar.Brand>
            {props.title}
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
    ) : (
      <p />
    )}
    <Grid>
      {props.children}
    </Grid>
  </div>
)

export {Page}
