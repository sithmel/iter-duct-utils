const fs = require('fs')
const { promisify } = require('util')
const { getLogger } = require('iter-duct')
const { valueOrFunc } = require('./utils')

const writeFile = promisify(fs.writeFile)

function jsonWriter (cfg) {
  const logger = getLogger()
  return async function * (iterable) {
    for await (const item of iterable) {
      try {
        const path = valueOrFunc(item, cfg.filename)
        logger.log({ level: 'debug', message: `write json to ${path}`, item })
        await writeFile(path, JSON.stringify(item, undefined, 2), 'utf8')
        yield item
      } catch (error) {
        logger.log({ level: 'error', message: 'error wring json', error })
        throw error
      }
    }
  }
}
module.exports = jsonWriter
