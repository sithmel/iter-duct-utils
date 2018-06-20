/* eslint-env node, mocha */
const { assert } = require('chai')
const itools = require('iter-tools')
const getLogger = require('../logger')
const sinon = require('sinon')

describe('logger', () => {
  const testObject = [{
    _id: '11249968',
    title: 'My solos transcribed',
    authorName: 'Slash'
  },
  {
    _id: '11249970',
    title: 'Your solos transcribed',
    authorName: 'Paperino'
  }]

  it('logs the current item using a string', async () => {
    const spyConsole = sinon.spy(console, 'log')

    const template = '<- working on this'
    const logger = getLogger({ template: template })
    const result = await itools.asyncIterToArray(logger(testObject))
    spyConsole.restore()

    assert.deepEqual(result, testObject)

    assert.equal(spyConsole.calledWith(0, template), true)
    assert.equal(spyConsole.calledWith(1, template), true)
  })
  it('logs the current item using a function', async () => {
    const spyConsole = sinon.spy(console, 'log')

    const templateFn = (obj) => `working on ${obj._id}`
    const logger = getLogger({ template: templateFn })
    const result = await itools.asyncIterToArray(logger(testObject))

    spyConsole.restore()

    assert.deepEqual(result, testObject)

    assert.equal(spyConsole.calledWith(0, 'working on 11249968'), true)
    assert.equal(spyConsole.calledWith(1, 'working on 11249970'), true)
  })
})
