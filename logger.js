const it = require('iter-tools')
const { valueOrFunc } = require('./utils')

// {
//   template: (obj) => `Working on ${obj._id}`
// }

function getLogger (cfg) {
  return async function * (iterable) {
    for await (const [n, obj] of it.asyncEnumerate(iterable)) {
      console.log(n, valueOrFunc(obj, cfg.template))
      yield obj
    }
  }
}

module.exports = getLogger
