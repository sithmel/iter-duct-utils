const { valueOrFunc, getJSON, asyncMapBatch } = require('./utils')
const { getLogger } = require('iter-duct')

// {
//   url: 'http://www.example.com/resource/${this._id}/bundle'
//   concurrency: 4
// }

function getJSONData ({ url, concurrency, headers }) {
  const logger = getLogger()
  concurrency = concurrency || 4
  return function (iterable) {
    return asyncMapBatch(concurrency, async (obj) => {
      const currentUrl = valueOrFunc(obj, url)
      logger.log({ level: 'debug', message: `get json from ${currentUrl}`, item: obj })
      try {
        const payload = await getJSON(currentUrl, headers)
        return payload
      } catch (error) {
        logger.log({ level: 'error', message: `error downloading json ${currentUrl}`, error, item: obj })
        throw error
      }
    }, iterable)
  }
}

module.exports = getJSONData
