const fs = require('fs')
const { promisify } = require('util')
const glob = require('glob')
const { valueOrFunc } = require('./utils')
const { getLogger } = require('iter-duct')

const readFile = promisify(fs.readFile)
const globPromise = promisify(glob)

function jsonReader (cfg) {
  const logger = getLogger()
  return async function * (iterable) {
    for await (const item of iterable || [{}]) {
      try {
        const path = valueOrFunc(item, cfg.files)
        const files = await globPromise(path)
        for (const file of files) {
          logger.log({ level: 'debug', message: `read json from file ${file}` })
          const fileContent = await readFile(file, 'utf8')
          yield JSON.parse(fileContent)
        }
      } catch (error) {
        logger.log({ level: 'error', message: 'error reading json', error, item })
        throw error
      }
    }
  }
}

module.exports = jsonReader
