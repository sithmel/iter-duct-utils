/* eslint-env node, mocha */
const { assert } = require('chai')
const itools = require('iter-tools')
const map = require('../map')

describe('map', () => {
  it('input object equals mapped', async () => {
    const multiplier = (item) => item * item
    const mapper = map({ func: multiplier })
    const squares = await itools.asyncIterToArray(mapper([1, 2, 3]))
    assert.deepEqual(squares, [1, 4, 9])
  })
})
