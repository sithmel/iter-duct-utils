/* eslint-env node, mocha */
const { assert } = require('chai')
const itools = require('iter-tools')
const filter = require('../filter')

describe('filter', () => {
  it('filters objects from a sequence', async () => {
    var items = ['guitar', 'bass', 'drums', 'vocals', 'synth', 'bagpipes']
    const condition = (item) => item.length > 5
    const filterer = filter({ func: condition })
    const result = await itools.asyncIterToArray(filterer(items))
    assert.deepEqual(result, ['guitar', 'vocals', 'bagpipes'])
  })
})
