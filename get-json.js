const it = require('iter-tools/es2018')
const { valueOrFunc, getJSON, asyncMapBatch } = require('./utils')

// {
//   url: 'http://www.example.com/resource/${this._id}/bundle'
//   concurrency: 4
// }

function getJSONData ({ url, concurrency, headers }) {
  concurrency = concurrency || 4
  return function (iterable) {
    return asyncMapBatch(concurrency, async (obj) => {
      const currentUrl = valueOrFunc(obj, url)
      const payload = await getJSON(currentUrl, headers)
      return payload
    }, iterable)
  }
}

module.exports = getJSONData
