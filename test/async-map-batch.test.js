/* eslint-env node, mocha */
const { asyncMapBatch } = require('../utils')
const { range, asyncIterToArray } = require('iter-tools/es2018')
const assert = require('chai').assert

function delay (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms)
  })
}

async function slowSquare (item) {
  await delay(10)
  return item * item
}

describe('asyncMapBatch', function () {
  it('runs 2 in parallel', async function () {
    const iter = asyncMapBatch(2, slowSquare, range(8))
    const t0 = Date.now()
    assert.deepEqual(await asyncIterToArray(iter), [0, 1, 4, 9, 16, 25, 36, 49])
    const t1 = Date.now()
    assert.isBelow(t1 - t0, 60)
  })
  it('runs 4 in parallel', async function () {
    const iter = asyncMapBatch(4, slowSquare, range(8))
    const t0 = Date.now()
    assert.deepEqual(await asyncIterToArray(iter), [0, 1, 4, 9, 16, 25, 36, 49])
    const t1 = Date.now()
    assert.isBelow(t1 - t0, 40)
  })
})
