/* eslint-env node, mocha */
const path = require('path')
const { assert } = require('chai')
const itools = require('iter-tools')
const fs = require('fs')
const csvWriter = require('../csv-writer')

const testfile = path.join(__dirname, 'superheroes_toremove.csv')

const cleanUp = () => {
  try {
    fs.unlinkSync(testfile)
  } catch (e) {}
}

describe('csv-reader', () => {
  beforeEach(cleanUp)
  afterEach(cleanUp)

  it('works simple case', async () => {
    const writer = csvWriter({
      filename: testfile
    })
    await itools.asyncIterToArray(writer([
      {
        Names: 'Superman',
        Superpowers: 'flying,super strenght'
      },
      {
        Names: 'Batman',
        Superpowers: 'None'
      }
    ]))
    const content = fs.readFileSync(testfile, 'utf8')
    assert.equal(content, `Names,Superpowers
Superman,"flying,super strenght"
Batman,None
`)
  })
})
