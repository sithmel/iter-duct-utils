const fs = require('fs')
const { valueOrFunc, downloadFile, asyncMapBatch } = require('./utils')
const { getLogger } = require('iter-duct')

// {
//   skipExisting: false
//   url: 'http://www.example.com/resource/${this._id}/bundle'
//   filename: '${this._id}.zip'
//   concurrency: 4
// }

function getDownload ({ skipExisting, url, filename, concurrency }) {
  concurrency = concurrency || 4
  const logger = getLogger()

  return function (iterable) {
    return asyncMapBatch(concurrency, async (obj) => {
      const currentFile = valueOrFunc(obj, filename)
      const currentUrl = valueOrFunc(obj, url)
      if (skipExisting && fs.existsSync(currentFile)) {
        logger.log({ level: 'debug', message: `download file skipping ${currentFile}`, item: obj })
        return
      }
      logger.log({ level: 'debug', message: `downloading ${currentUrl} to ${currentFile}`, item: obj })
      try {
        await downloadFile(currentUrl, currentFile)
        return obj
      } catch (error) {
        logger.log({ level: 'error', message: `error downloading file ${currentUrl}`, error, item: obj })
        throw error
      }
    }, iterable)
  }
}

module.exports = getDownload
