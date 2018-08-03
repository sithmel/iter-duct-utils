const fs = require('fs')
const it = require('iter-tools/es2018')
const { valueOrFunc } = require('./utils')
const { getLogger } = require('iter-duct')

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
  const logger = getLogger()
  return async function * (iterable) {
    for await (const obj of iterable || [{}]) {
      const filename = valueOrFunc(obj, cfg.filename)
      try {
        const stream = fs.createReadStream(filename, { encoding: cfg.encoding || 'utf8', highWaterMark: cfg.highWaterMark || 1024 })
        const extractor = getExtractor(cfg)
        yield * extractor(stream)
      } catch (error) {
        logger.log({ level: 'error', message: `error reading file ${filename}`, error, item: obj })
        throw error
      }
    }
  }
}

module.exports = readfile
