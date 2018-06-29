/* eslint-env node, mocha */
const path = require('path')
const { assert } = require('chai')
const itools = require('iter-tools')
const exec = require('../exec')

const filename = path.join(__dirname, 'superheroes.txt')

describe.skip('exec', () => {
  it('works simple case', async () => {
    const reader = exec({ cmd: `cat ${filename}` })
    assert.deepEqual(await itools.asyncIterToArray(reader()), [
      'Superman,Clark Kent',
      'Batman,Bruce Wayne',
      ''
    ])
  })

  it('works with split', async () => {
    const reader = exec({cmd: `cat ${filename}`, split: /[,\n]*/ })
    assert.deepEqual(await itools.asyncIterToArray(reader()), [
      'Superman', 'Clark Kent',
      'Batman', 'Bruce Wayne',
      ''
    ])
  })

  it('works with extract', async () => {
    const reader = exec({ cmd: `cat ${filename}`, extract: /,([^\n]+)\n/ })
    const array = await itools.asyncIterToArray(reader())
    assert.deepEqual(array.map((item) => item[1]), [
      'Clark Kent',
      'Bruce Wayne',
    ])
  })
})
