import React from 'react'
import FontAwesome from 'react-fontawesome'
import {connect} from 'react-redux'

import {getStudentsSection, getStudentsUnion} from '../selectors'

const DumbIndicatorBlock = ({bsClass, faIconName, text}) => (
  <div className={'indicator-block indicator-block-'.concat(bsClass)}>
    <FontAwesome className="icon" name={faIconName} />
    <span className="text">{text}</span>
  </div>
)

const mapUnionStateToProps = (state) => ({
  object: getStudentsUnion(state),
  noneText: 'No union membership',
  unknownText: 'Unknown union membership'
})

const mapSectionStateToProps = (state) => ({
  object: getStudentsSection(state),
  noneText: 'No section membership',
  unknownText: 'Unknown section membership'
})

const IndicatorBlock = ({object, noneText, unknownText}) => {
  switch (object) {
    case null:
      return DumbIndicatorBlock(
        {bsClass: 'danger', faIconName: 'thumbs-down', text: noneText})
    case undefined:
      return DumbIndicatorBlock(
        {bsClass: 'default', faIconName: 'question', text: unknownText})
    default:
      return DumbIndicatorBlock(
        {bsClass: 'success', faIconName: 'thumbs-up', text: object.get('name')})
  }
}

const UnionIndicator = connect(mapUnionStateToProps)(IndicatorBlock)
UnionIndicator.propTypes = {}

const SectionIndicator = connect(mapSectionStateToProps)(IndicatorBlock)
SectionIndicator.propTypes = {}

export {SectionIndicator, UnionIndicator}
