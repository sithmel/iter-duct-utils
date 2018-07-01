const fs = require('fs')
const csv = require('fast-csv')

// {
//   filename: 'test.csv'
//   options: { header: true }
// }

function getCSVWriter (cfg) {
  return async function * (iterable) {
    const csvStream = csv.createWriteStream(cfg.options)
    const writableStream = fs.createWriteStream(cfg.filename)
    csvStream.pipe(writableStream)
    for await (const obj of iterable) {
      csvStream.write(obj)
      yield obj
    }
    csvStream.end()
  }
}

module.exports = getCSVWriter
