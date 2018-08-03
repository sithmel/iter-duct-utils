const fs = require('fs')
const csvWriter = require('csv-write-stream')
const { getLogger } = require('iter-duct')

// {
//   filename: 'test.csv'
//   options: {
//     separator: ',',
//     newline: '\n',
//     headers: undefined,
//     sendHeaders: true
//   }
// }

function getCSVWriter (cfg) {
  const logger = getLogger()
  return async function * (iterable) {
    try {
      const writer = csvWriter(cfg)
      const fileStream = fs.createWriteStream(cfg.filename)
      writer.pipe(fileStream)

      for await (const obj of iterable) {
        logger.log({ level: 'debug', message: 'writing line', item: obj })
        await new Promise((resolve, reject) => {
          writer.write(obj, (err) => {
            if (err) return reject(err)
            resolve()
          })
        })
        yield obj
      }
      logger.log({ level: 'debug', message: 'closing csv' })
      await new Promise((resolve, reject) => {
        writer.end()
        fileStream.end((err) => {
          if (err) return reject(err)
          resolve()
        })
      })
    } catch (error) {
      logger.log({ level: 'error', message: 'error writing csv', error })
      throw error
    }
  }
}

module.exports = getCSVWriter
