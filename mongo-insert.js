const MongoClient = require('mongodb').MongoClient
const format = require('util').format
const { valueOrFunc } = require('./utils')
// {
//   host: 'mongodb01-az1.live.xxx.com',
//   user: 'resourcexxx',
//   password: 'xxx',
//   collection: 'resourcesxxx',
//   db: 'resource',
//   doc: { authorId: 2127200 }
//   options: {}
// }

function getMongoUpdate (cfg) {
  const user = encodeURIComponent(cfg.user)
  const password = encodeURIComponent(cfg.password)
  const authMechanism = 'SCRAM-SHA-1'// || 'DEFAULT';
  const port = cfg.port || '27017'
  const host = cfg.host || 'localhost'

  const url = format('mongodb://%s:%s@%s:%s/?authMechanism=%s&authSource=resource',
    user, password, host, port, authMechanism)

  return async function * (iterable) {
    let client
    try {
      client = await MongoClient.connect(url)
      const db = client.db(cfg.db)
      const collection = db.collection(cfg.collection)
      for await (const item of iterable) {
        await collection.insertOne(valueOrFunc(item, cfg.doc), valueOrFunc(item, cfg.options))
        yield item
      }
    } catch (e) {
      console.log(e.stack)
    }
    if (client) {
      client.close()
    }
  }
}

module.exports = getMongoUpdate
