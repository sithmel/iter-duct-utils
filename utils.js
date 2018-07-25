const fs = require('fs')
const it = require('iter-tools/es2018')
const superagent = require('superagent')
const MongoClient = require('mongodb').MongoClient

function downloadFile (url, file) {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .on('error', function (error) {
        reject(error)
      })
      .pipe(fs.createWriteStream(file))
      .on('finish', function () {
        resolve()
      })
  })
}

function getJSON (url, headers = {}) {
  return superagent
    .get(url)
    .set(headers)
    .then((res) => res.body)
}

function postJSON (url, payload, method = 'POST', headers = {}) {
  return superagent(method, url)
    .send(payload)
    .set(headers)
    .then((res) => res.body)
}

function postForm (url, formData, method = 'POST', headers = {}) {
  const request = superagent(method, url)
    .set(headers)
    .accept('application/json')

  for (const { attachment, name, value, options } of formData) {
    if (attachment) {
      request
        .attach(name, value, options)
    } else {
      request
        .field(name, value)
    }
  }
  return request
    .then((res) => res.body)
}

function valueOrFunc (obj, func) {
  if (typeof func === 'function') {
    return func(obj)
  }
  return func
}

async function * asyncMapBatch (number, func, iterable) {
  for await (const items of it.asyncBatch(number, iterable)) {
    const results = await Promise.all(it.map(func, items))
    yield * results
  }
}

function getMongoClient (cfg) {
  const user = encodeURIComponent(cfg.user)
  const password = encodeURIComponent(cfg.password)
  const userPass = user ? `${user}:${password}@` : ''
  const authMechanism = 'SCRAM-SHA-1'// || 'DEFAULT';
  const port = cfg.port || '27017'
  const host = cfg.host || 'localhost'
  const authDb = cfg.authDb || 'admin'

  const url = `mongodb://${userPass}${host}:${port}/?authMechanism=${authMechanism}&authSource=${authDb}`
  return MongoClient.connect(url)
}

module.exports = {
  valueOrFunc,
  downloadFile,
  getJSON,
  postJSON,
  asyncMapBatch,
  getMongoClient,
  postForm
}
