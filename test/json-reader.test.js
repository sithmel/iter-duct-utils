/* eslint-env node, mocha */
const { assert } = require('chai')
const itools = require('iter-tools')
const jsonReader = require('../json-reader')

describe('json-reader', () => {
  it('works simple case', async () => {
    const reader = jsonReader({ files: './test/json/*.json' })
    const results = await itools.asyncIterToArray(reader())
    assert.deepEqual(results, [
      [
        {
          name: 'Mickey Mouse',
          type: 'mouse',
          gender: 'male'
        },
        {
          name: 'Minnie Mouse',
          type: 'mouse',
          gender: 'female'
        }
      ],
      [
        {
          name: 'Superman',
          superpower: 'flying, super strenght'
        },
        {
          name: 'Batman',
          superpower: false
        }
      ]
    ])
  })
})
