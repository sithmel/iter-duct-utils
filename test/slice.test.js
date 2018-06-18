/* eslint-env node, mocha */
const { assert } = require('chai')
const itools = require('iter-tools')
const slice = require('../slice')

describe('slice', () => {
  it('slices the sequence', async () => {
    const array = [1, 2, 3, 4, 5]
    const slicer = slice({ start: 1, end: 4 })
    const sequence = await itools.asyncIterToArray(slicer(array))
    assert.deepEqual(sequence, [2, 3, 4])
  })
})
