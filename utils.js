const it = require('iter-tools')
const fs = require('fs')
const superagent = require('superagent')

function downloadFile (url, file) {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .on('error', function (error) {
        reject(error);
      })
      .pipe(fs.createWriteStream(file))
      .on('finish', function () {
        resolve();
      })
  })
}

function getJSON (url) {
  return superagent
    .get(url)
    .then((res) => res.body)
}

function postJSON (url, payload, method = 'POST') {
  return superagent(method, url)
    .send(payload)
    .then((res) => res.body)
}

function valueOrFunc (obj, func) {
  if (typeof func === 'function') {
    return func(obj)
  }
  return func
}

module.exports = {
  valueOrFunc,
  downloadFile,
  getJSON,
  postJSON
}
