const { valueOrFunc, postForm, asyncMapBatch } = require('./utils')
const { getLogger } = require('iter-duct')

// {
//   url: 'http://www.example.com/resource/${this._id}/bundle'
//   concurrency: 4
// }

function postFormData ({ url, concurrency, formData, method, headers, onErrorContinue }) {
  const logger = getLogger()
  concurrency = concurrency || 4
  return function (iterable) {
    iterable = iterable || [{}]
    return asyncMapBatch(concurrency, async (obj) => {
      const currentUrl = valueOrFunc(obj, url)
      const currentFormData = valueOrFunc(obj, formData)
      const currentHeaders = valueOrFunc(obj, headers)
      logger.log({ level: 'debug', message: `post form to ${currentUrl}`, item: obj })
      return postForm(currentUrl, currentFormData, method, currentHeaders)
        .catch((error) => {
          logger.log({ level: 'error', message: `error post form to ${currentUrl}`, error, item: obj })
          if (onErrorContinue) {
            return Promise.resolve(null)
          }
          return Promise.reject(error)
        })
    }, iterable)
  }
}

module.exports = postFormData
