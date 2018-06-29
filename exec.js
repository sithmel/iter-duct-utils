const fs = require('fs')
const it = require('iter-tools/es2018')
const { spawn } = require('child_process')
const { valueOrFunc } = require('./utils')

// {
//   cmd: 'ls'
//   extract: ' '
//   split: ' '
// }

function getExtractor(cfg) {
  if (cfg.extract) {
    return it.asyncRegexpExecIter(cfg.extract)
  }
  if (cfg.split) {
    return it.asyncRegexpSplitIter(cfg.split)
  }
  return it.asyncSplitLines
}

function exec (cfg) {
  return async function * (iterable) {
    for await (const obj of iterable || [{}]) {
      const [command, ...args] = valueOrFunc(obj, cfg.cmd).split(/\s+/)
      const cmd = spawn(command, args)
      const stream = cmd.stdout
      const extractor = getExtractor(cfg)
      yield * extractor(stream)
    }
  }
}

module.exports = exec