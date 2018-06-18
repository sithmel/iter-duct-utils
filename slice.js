const it = require('iter-tools/es2018')

function slice ({ start, end }) {
  return function (iterable) {
    return it.asyncSlice({ start, end }, iterable)
  }
}

module.exports = slice
