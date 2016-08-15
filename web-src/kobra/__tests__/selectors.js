jest.unmock('immutable')
jest.unmock('../selectors')

import {fromJS} from 'immutable'

import * as selectors from '../selectors'

describe('getSelectedEvent', () => {
  const state = fromJS({
    meta: {
      events: {
        selected: null
      }
    },
    events: [
      {url: 'https://api/events/1', id: 1},
      {url: 'https://api/events/2', id: 2},
      {url: 'https://api/events/3', id: 3}
    ]
  })

  it('returns null when no event is selected', () => {
    const result = selectors.getSelectedEvent(state)

    expect(result).toEqual(null)
  })

  it('returns the selected event', () => {
    const selectedEvent = state.getIn(['events', 1])
    const result = selectors.getSelectedEvent(state
      .setIn(['meta', 'events', 'selected'], selectedEvent.get('url')))

    expect(result).toEqual(selectedEvent)
  })
})
