/* eslint-env node, mocha */
const { assert } = require('chai')
const itools = require('iter-tools')
const jsonReader = require('../json-reader')

describe('json-reader', () => {
  it('works simple case', async () => {
    const reader = jsonReader({ path: './test/json/*.json' })
    const results = await itools.asyncIterToArray(reader())
    const { superheroes } = results[1]
    const { disney } = results[0]

    assert.deepEqual(superheroes, [
      { name: 'Superman', superpower: 'flying, super strenght' },
      { name: 'Batman', superpower: false }
    ])
    assert.deepEqual(disney, [
      { name: 'Mickey Mouse', type: 'mouse', gender: 'male' },
      { name: 'Minnie Mouse', type: 'mouse', gender: 'female' },
      { name: 'Goofy', type: 'dog', gender: 'male' },
      { name: 'Paperino', type: 'duck', gender: 'male' }
    ])
  })
})
