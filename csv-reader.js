const fs = require('fs')
const it = require('iter-tools/es2018')
const { valueOrFunc, splitCSVRow } = require('./utils')

// {
//   filename: 'test.csv'
//   encoding: 'utf8'
// }

function getCSVReader(cfg) {
  return function (iterable) {
    const readStream = fs.createReadStream(cfg.filename, { encoding: cfg.encoding || 'utf8', highWaterMark: 1024 })
    const nonEmpty = it.asyncFilter((line) => !!line)
    return it.asyncMap(splitCSVRow, nonEmpty(it.asyncSplitLines(readStream)))
  }
}

module.exports = getCSVReader
