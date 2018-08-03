const fs = require('fs')
const csv = require('csv-parse')
const { getLogger } = require('iter-duct')

// {
//   filename: 'test.csv'
//   encoding: 'utf8'
// }

function getCSVReader (cfg) {
  const logger = getLogger()
  return async function * (iterable) {
    try {
      const readStream = fs.createReadStream(cfg.filename, { encoding: cfg.encoding || 'utf8', highWaterMark: 1024 })
      const iterable = readStream.pipe(csv(cfg))
      for await (const item of iterable) {
        yield item
      }
    } catch (error) {
      logger.log({ level: 'error', message: 'error reading csv', error })
      throw error
    }
  }
}

module.exports = getCSVReader
