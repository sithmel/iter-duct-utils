const it = require('iter-tools/es2018')
const { valueOrFunc, postJSON, asyncMapBatch } = require('./utils')

// {
//   url: 'http://www.example.com/resource/${this._id}/bundle'
//   concurrency: 4
// }

function postJSONData ({ url, concurrency, payload, method, headers }) {
  concurrency = concurrency || 4
  return function (iterable) {
    const postInParallel = asyncMapBatch(concurrency, async (obj) => {
      const currentUrl = valueOrFunc(obj, url)
      const currentPayload = valueOrFunc(obj, payload)
      const currentHeaders = valueOrFunc(obj, headers)
      return postJSON(currentUrl, currentPayload, method, currentHeaders)
    })
    return postInParallel(iterable)
  }
}

module.exports = postJSONData
