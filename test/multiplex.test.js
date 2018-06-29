/* eslint-env node, mocha */
const { assert } = require('chai')
const itools = require('iter-tools')
const multiplex = require('../multiplex')

describe('multiplex', () => {
  it('input object equals mapped', async () => {
    const iter = multiplex(itools.asyncMap((item) => item * item), itools.asyncMap((item) => item * 2))
    const multiplexed = await itools.asyncIterToArray(iter([2, 4, 6]))
    assert.deepEqual(multiplexed, [[4, 4], [16, 8], [36, 12]])
  })
})
