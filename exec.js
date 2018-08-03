const it = require('iter-tools/es2018')
const { spawn } = require('child_process')
const { valueOrFunc } = require('./utils')
const { getLogger } = require('iter-duct')

// {
//   cmd: 'ls'
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

function exec (cfg) {
  const logger = getLogger()
  return async function * (iterable) {
    for await (const obj of iterable || [{}]) {
      try {
        const [command, ...args] = valueOrFunc(obj, cfg.cmd).split(/\s+/)
        logger.log({ level: 'debug', message: `executing ${command}`, item: obj })
        const cmd = spawn(command, args)
        const stream = cmd.stdout
        const extractor = getExtractor(cfg)
        yield * extractor(stream)
      } catch (error) {
        logger.log({ level: 'error', message: 'error executing command', error, item: obj })
        throw error
      }
    }
  }
}

module.exports = exec
