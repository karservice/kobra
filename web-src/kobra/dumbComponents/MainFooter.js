import React from 'react'

export const MainFooter = (props) => (
  <footer style={{fontSize: '85%'}}>
    <hr />
    <div className={'row'}>
      <div className={'col-sm-4 text-muted'}>
        <p>
          Provided by <a href="http://www.karservice.se/"
                         target="_blank">Kårservice Östergötland AB</a><br />
          Developed by <a href="https://www.vidner.se/"
                          target="_blank">Vidner Solutions</a>
        </p>
      </div>
      <div className={'col-sm-4'}>

      </div>
      <div className={'col-sm-4 text-muted'}>
        <p><a href="#">API Documentation</a></p>
      </div>
    </div>
  </footer>
)
