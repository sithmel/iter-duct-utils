const { valueOrFunc, postJSON, asyncMapBatch } = require('./utils')
const { getLogger } = require('iter-duct')

// {
//   url: 'http://www.example.com/resource/${this._id}/bundle'
//   concurrency: 4
// }

function postJSONData ({ url, concurrency, payload, method, headers, onErrorContinue }) {
  const logger = getLogger()
  concurrency = concurrency || 4
  return function (iterable) {
    return asyncMapBatch(concurrency, async (obj) => {
      const currentUrl = valueOrFunc(obj, url)
      const currentPayload = valueOrFunc(obj, payload)
      const currentHeaders = valueOrFunc(obj, headers)
      logger.log({ level: 'debug', message: `post json to ${currentUrl}`, item: obj })
      return postJSON(currentUrl, currentPayload, method, currentHeaders)
        .catch((error) => {
          logger.log({ level: 'error', message: `error post json to ${currentUrl}`, error, item: obj })
          if (onErrorContinue) {
            return Promise.resolve(null)
          }
          return Promise.reject(error)
        })
    }, iterable)
  }
}

module.exports = postJSONData
