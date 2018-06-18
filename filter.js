const it = require('iter-tools/es2018')

function filter ({ func }) {
  return function (iterable) {
    return it.asyncFilter(func, iterable)
  }
}

module.exports = filter
