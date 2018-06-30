/* eslint-env node, mocha */
const path = require('path')
const { assert } = require('chai')
const itools = require('iter-tools/es2018')
const readfile = require('../readfile')

describe('readfile', () => {
  it('works simple case', async () => {
    const reader = readfile({ filename: path.join(__dirname, 'superheroes.txt') })
    assert.deepEqual(await itools.asyncIterToArray(reader()), [
      'Superman,Clark Kent',
      'Batman,Bruce Wayne',
      ''
    ])
  })

  it('works with split', async () => {
    const reader = readfile({ filename: path.join(__dirname, 'superheroes.txt'), split: /[,\n]+/ })
    assert.deepEqual(await itools.asyncIterToArray(reader()), [
      'Superman', 'Clark Kent',
      'Batman', 'Bruce Wayne',
      ''
    ])
  })

  it('works with extract', async () => {
    const reader = readfile({ filename: path.join(__dirname, 'superheroes.txt'), extract: /(^[^\n,]+)/gm })
    const array = await itools.asyncIterToArray(reader())
    assert.deepEqual(array.map((item) => item[1]), [
      'Superman',
      'Batman'
    ])
  })
})
