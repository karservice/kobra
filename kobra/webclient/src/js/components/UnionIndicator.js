import React from 'react'
import FontAwesome from 'react-fontawesome'
import {connect} from 'react-redux'

import {getStudentsUnion} from '../selectors'

const IndicatorBlock = ({bsClass, faIconName, text}) => (
  <div className={'indicator-block indicator-block-'.concat(bsClass)}>
    <FontAwesome className="icon" name={faIconName} />
    <span className="text">{text}</span>
  </div>
)

const mapStateToProps = (state) => ({
  union: getStudentsUnion(state)
})

const UnionIndicator = connect(mapStateToProps)((props) => {
  switch (props.union) {
    case null:
      return IndicatorBlock(
        {bsClass: 'danger', faIconName: 'thumbs-down', text: 'No union membership'})
    case undefined:
      return IndicatorBlock(
        {bsClass: 'default', faIconName: 'question', text: 'Unknown union membership'})
    default:
      return IndicatorBlock(
        {bsClass: 'success', faIconName: 'thumbs-up', text: props.union.get('name')})
  }
})

export {UnionIndicator}
