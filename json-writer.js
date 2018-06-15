const fs = require('fs')
const { promisify } = require('util')
const it = require('iter-tools/es2018')
const { valueOrFunc } = require('./utils')

const writeFile = promisify(fs.writeFile)
const globPromise = promisify(glob)

function jsonWriter(cfg) {
  return async function * (iterable) {
    for await (const item of iterable) {
      const path = valueOrFunc(item, cfg.filename)
      await writeFile(path, JSON.stringify(item, undefined, 2), 'utf8')
      yield item
    }
  }
}
module.exports = jsonWriter
