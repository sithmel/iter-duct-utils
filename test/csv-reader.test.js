/* eslint-env node, mocha */
const path = require('path')
const { assert } = require('chai')
const itools = require('iter-tools')
const csvReader = require('../csv-reader')

describe('csv-reader', () => {
  it('works simple case', async () => {
    const reader = csvReader({
      filename: path.join(__dirname, 'superheroes.csv'),
      headers: true,
      ignoreEmpty: true,
    })
    assert.deepEqual(await itools.asyncIterToArray(reader()), [
      {
        Names: 'Superman',
        'Superpowers': 'flying,super strenght'
      },
      {
        Names: 'Batman',
        Superpowers: 'None'
      }
    ])
  })
})
