const fs = require('fs')
const it = require('iter-tools/es2018')
const { valueOrFunc } = require('./utils')

// {
//   filename:
//   extract: ' '
//   split: ' '
// }

function getExtractor ({ extract, split }) {
  if (extract) {
    return it.asyncRegexpExecIter(extract)
  }
  if (split) {
    return it.asyncRegexpSplitIter(split)
  }
  return it.asyncSplitLines
}

function readfile (cfg) {
  return async function * (iterable) {
    for await (const obj of iterable || [{}]) {
      const filename = valueOrFunc(obj, cfg.filename)
      const stream = fs.createReadStream(filename, { encoding: cfg.encoding || 'utf8', highWaterMark: cfg.highWaterMark || 1024 })
      const extractor = getExtractor(cfg)
      yield * extractor(stream)
    }
  }
}

module.exports = readfile
