import React from 'react'
import {connect} from 'react-redux'

import {IndicatorBlock as DumbIndicatorBlock} from '../dumbComponents'
import {getStudentsSection, getStudentsUnion} from '../selectors'


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

export const UnionIndicator = connect(mapUnionStateToProps)(IndicatorBlock)
UnionIndicator.propTypes = {}

export const SectionIndicator = connect(mapSectionStateToProps)(IndicatorBlock)
SectionIndicator.propTypes = {}
