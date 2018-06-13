const superagent = require('superagent')
const fs = require('fs')
const it = require('iter-tools/es2018')
const { valueOrFunc } = require('./utils')

function downloadFile(url, file) {
  return new Promise((resolve, reject)=> {
    superagent
      .get(url)
      .on('error', function(error) {
        reject(error);
      })
      .pipe(fs.createWriteStream(file))
      .on('finish', function() {
        resolve(file);
      });
    });
}

// {
//   skipExisting: false
//   url: 'http://www.example.com/resource/${this._id}/bundle'
//   filename: '${this._id}.zip'
//   concurrency: 4
// }

function getDownload({ skipExisting, url, filename, concurrency }) {
  concurrency = concurrency || 4
  return function (iterable) {
    const downloadInParallel = it.asyncMapBatch(concurrency, async (obj) => {
      const currentFile = valueOrFunc(obj, filename)
      const currentUrl = valueOrFunc(obj, url)
      if (skipExisting && fs.existsSync(currentFile)) {
        return
      }
      return downloadFile(currentUrl, currentFile)
    })
    return downloadInParallel(iterable)
  }
}

module.exports = getDownload
