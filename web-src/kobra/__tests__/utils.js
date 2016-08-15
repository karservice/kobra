jest.unmock('immutable')
jest.unmock('../utils')

import {List, Map} from 'immutable'

import {intersection} from '../utils'

describe('intersection', () => {
  it('filters an array of objects', () => {
    const array1 = [
      {a: 1, c: 'a'},
      {a: 2, c: 'b'},
      {a: 3, c: 'c'}
    ]
    const array2 = [
      {b: 1, d: 'a'},
      {b: 3, d: 'b'},
      {b: 1, d: 'c'}
    ]

    const result = array1.filter(
      intersection(array2, (array1Elem, array2Elem) => (
        array1Elem.a === array2Elem.b
      ))
    )

    expect(result).toEqual([
      {a: 1, c: 'a'},
      {a: 3, c: 'c'}
    ])
  })

  it('filters a List of Maps', () => {
    const list1 = List.of(
      Map.of('a', 1, 'c', 'a'),
      Map.of('a', 2, 'c', 'b'),
      Map.of('a', 3, 'c', 'c')
    )

    const list2 = List.of(
      Map.of('b', 1, 'd', 'a'),
      Map.of('b', 3, 'd', 'b'),
      Map.of('b', 1, 'd', 'c')
    )

    const result = list1.filter(
      intersection(list2, (list1Elem, list2Elem) => (
        list1Elem.get('a') === list2Elem.get('b')
      ))
    )

    expect(result).toEqual(List.of(
      Map.of('a', 1, 'c', 'a'),
      Map.of('a', 3, 'c', 'c')
    ))
  })
})
