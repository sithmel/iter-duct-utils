const it = require('iter-tools/es2018')

function throttle(cfg) {
  return function (iterable) {
    if (cfg.ms) {
      return it.asyncThrottle(cfg.ms, iterable)
    }
    return iterable
  }
}

module.exports = throttle
