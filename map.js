const it = require('iter-tools/es2018')

function map({ func }) {
  return function (iterable) {
    return it.asyncMap(func, iterable)
  }
}
module.exports = map
