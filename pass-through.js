const it = require('iter-tools/es2018')

function passThrough () {
  return function (iterable) {
    return iterable
  }
}

module.exports = passThrough
