const superagent = require('superagent');
const templateString = require('template-strings')
const fs = require('fs')
const it = require('iter-tools/es2018')

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
  return async function * (iterable) {
    const downloadInParallel = it.asyncMapBatch(concurrency, (obj) => {
      const currentFile = templateString(filename, obj)
      const currentUrl = templateString(url, obj)
      if (skipExisting && fs.existsSync(currentFile)) {
        continue;
      }
      return await downloadFile(currentUrl, currentFile);
    })
    return downloadInParallel(iterable)
    }
  }
}

module.exports = getDownload
