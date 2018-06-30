const fs = require('fs')
const csv = require('fast-csv')

// {
//   filename: 'test.csv'
//   encoding: 'utf8'
// }

function getCSVReader (cfg) {
  return function (iterable) {
    const readStream = fs.createReadStream(cfg.filename, { encoding: cfg.encoding || 'utf8', highWaterMark: 1024 })
    return readStream.pipe(csv(cfg))
  }
}

module.exports = getCSVReader
