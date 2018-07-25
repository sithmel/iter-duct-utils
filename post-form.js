const { valueOrFunc, postForm, asyncMapBatch } = require('./utils')

// {
//   url: 'http://www.example.com/resource/${this._id}/bundle'
//   concurrency: 4
// }

function postFormData ({ url, concurrency, formData, method, headers }) {
  concurrency = concurrency || 4
  return function (iterable) {
    return asyncMapBatch(concurrency, async (obj) => {
      const currentUrl = valueOrFunc(obj, url)
      const currentFormData = valueOrFunc(obj, formData)
      const currentHeaders = valueOrFunc(obj, headers)
      return postForm(currentUrl, currentFormData, method, currentHeaders)
    }, iterable)
  }
}

module.exports = postFormData
