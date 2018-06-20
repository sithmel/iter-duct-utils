const fs = require('fs')
const { promisify } = require('util')
const glob = require('glob')
const { valueOrFunc } = require('./utils')

const readFile = promisify(fs.readFile)
const globPromise = promisify(glob)

function jsonReader (cfg) {
  return async function * (iterable) {
    for await (const item of iterable || [{}]) {
      const path = valueOrFunc(item, cfg.files)
      const files = await globPromise(path)
      for (const file of files) {
        const fileContent = await readFile(file, 'utf8')
        yield JSON.parse(fileContent)
      }
    }
  }
}

module.exports = jsonReader
