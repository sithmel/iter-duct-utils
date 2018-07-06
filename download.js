const fs = require('fs')
const { valueOrFunc, downloadFile, asyncMapBatch } = require('./utils')
// {
//   skipExisting: false
//   url: 'http://www.example.com/resource/${this._id}/bundle'
//   filename: '${this._id}.zip'
//   concurrency: 4
// }

function getDownload ({ skipExisting, url, filename, concurrency }) {
  concurrency = concurrency || 4
  return function (iterable) {
    return asyncMapBatch(concurrency, async (obj) => {
      const currentFile = valueOrFunc(obj, filename)
      const currentUrl = valueOrFunc(obj, url)
      if (skipExisting && fs.existsSync(currentFile)) {
        return
      }
      await downloadFile(currentUrl, currentFile)
      return obj
    }, iterable)
  }
}

module.exports = getDownload
