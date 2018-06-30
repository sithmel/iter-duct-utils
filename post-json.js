const it = require('iter-tools/es2018')
const { valueOrFunc, postJSON } = require('./utils')

// {
//   url: 'http://www.example.com/resource/${this._id}/bundle'
//   concurrency: 4
// }

function postJSONData ({ url, concurrency, payload, method }) {
  concurrency = concurrency || 4
  return function (iterable) {
    const postInParallel = it.asyncMapBatch(concurrency, async (obj) => {
      const currentUrl = valueOrFunc(obj, url)
      const currentPayload = valueOrFunc(obj, payload)
      await postJSON(currentUrl, currentPayload, method)
      return obj
    })
    return postInParallel(iterable)
  }
}

module.exports = postJSONData
