import React from 'react'
import FontAwesome from 'react-fontawesome'


export const IndicatorBlock = ({bsClass, faIconName, text}) => (
  <div className={'indicator-block indicator-block-'.concat(bsClass)}>
    <FontAwesome className="icon" name={faIconName} />
    <span className="text">{text}</span>
  </div>
)
