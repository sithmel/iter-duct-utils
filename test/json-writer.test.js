/* eslint-env node, mocha */
const { assert } = require('chai')
const itools = require('iter-tools')
const jsonWriter = require('../json-writer')
const fs = require('fs')

describe('json-writer', () => {
  before(() => {
    try {
      fs.unlinkSync('test1.json')
      fs.unlinkSync('test2.json')
    } catch (err) {}
  })

  after(() => {
    try {
      fs.unlinkSync('test1.json')
      fs.unlinkSync('test2.json')
    } catch (err) {}
  })

  it('works simple case', async () => {
    const writer = jsonWriter({ filename: (item) => `${item.id}.json` })
    const iterable = [
      { id: 'test1', name: 'Maurizio' },
      { id: 'test2', name: 'Fernando' }
    ]
    const results = await itools.asyncIterToArray(writer(iterable))
    assert.deepEqual(results, iterable)

    const test1 = fs.readFileSync('test1.json')
    assert.deepEqual(JSON.parse(test1), iterable[0])

    const test2 = fs.readFileSync('test2.json')
    assert.deepEqual(JSON.parse(test2), iterable[1])
  })
})
