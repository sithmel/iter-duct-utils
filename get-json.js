const it = require('iter-tools/es2018')
const { valueOrFunc, getJSON } = require('./utils')

// {
//   url: 'http://www.example.com/resource/${this._id}/bundle'
//   concurrency: 4
// }

function getJSONData ({ url, concurrency, headers }) {
  concurrency = concurrency || 4
  return function (iterable) {
    const getInParallel = it.asyncMapBatch(concurrency, async (obj) => {
      const currentUrl = valueOrFunc(obj, url)
      const payload = await getJSON(currentUrl, headers)
      return payload
    })
    return getInParallel(iterable)
  }
}

module.exports = getJSONData
