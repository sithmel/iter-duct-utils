const fs = require('fs')
const csvWriter = require('csv-write-stream')
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
  return async function * (iterable) {
    const writer = csvWriter(cfg)
    const fileStream = fs.createWriteStream(cfg.filename)
    writer.pipe(fileStream)

    for await (const obj of iterable) {
      await new Promise((resolve, reject) => {
        writer.write(obj, (err) => {
          if (err) return reject(err)
          resolve()
        })
      })
      yield obj
    }
    await new Promise((resolve, reject) => {
      writer.end()
      fileStream.end((err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }
}

module.exports = getCSVWriter
