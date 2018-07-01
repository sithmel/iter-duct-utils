const it = require('iter-tools/es2018')

function combine (pipeline) {
  return it.compose(pipeline.reverse())
}

module.exports = combine
