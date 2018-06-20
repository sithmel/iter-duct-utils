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

function splitCSVRow (row) {
  const colSplitter = it.regexpExec(/(?:^|,)(\"(?:[^\"]+|\"\")*\"|[^,]*)/g)
  const unwrapQuote = (field) => {
    const match = /^"?([^"]*)"?$/.exec(field)
    if (match) return match[1]
    return ''
  }
  const firstGroup = it.map((match) => match[1])
  const unwrap = it.map(unwrapQuote)
  return Array.from(unwrap(firstGroup(colSplitter(row))))
}

module.exports = {
  valueOrFunc,
  splitCSVRow,
  downloadFile,
  getJSON,
  postJSON
}
