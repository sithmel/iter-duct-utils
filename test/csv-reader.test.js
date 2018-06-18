/* eslint-env node, mocha */
const path = require('path')
const { assert } = require('chai')
const itools = require('iter-tools')
const { splitCSVRow } = require('../utils')
const csvReader = require('../csv-reader')

describe('splitCSVRow', () => {
  it('works simple case', () => {
    assert.deepEqual(splitCSVRow('a,b,c'), ['a', 'b', 'c'])
  })

  it('works with comma and quotes', () => {
    assert.deepEqual(splitCSVRow('a,"b,c","c"'), ['a', 'b,c', 'c'])
  })
})

describe('csv-reader', () => {
  it('works simple case', async () => {
    const reader = csvReader({ filename: path.join(__dirname, 'superheroes.csv') })
    assert.deepEqual(await itools.asyncIterToArray(reader()), [
      ['Names', 'Superpowers'],
      ['Superman', 'flying,super strenght'],
      ['Batman', 'None']
    ])
  })
})
