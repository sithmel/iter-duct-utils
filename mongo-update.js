const MongoClient = require('mongodb').MongoClient
const format = require('util').format
const { valueOrFunc, getMongoClient } = require('./utils')
// {
//   host: 'mongodb01-az1.live.xxx.com',
//   user: 'resourcexxx',
//   password: 'xxx',
//   collection: 'resourcesxxx',
//   db: 'resource',
//   doc: { authorId: 2127200 }
// }

function getMongoUpdate (cfg) {
  return async function * (iterable) {
    let client
    try {
      client = await getMongoClient(cfg)
      const db = client.db(cfg.db)
      const collection = db.collection(cfg.collection)
      if ('batchSize' in cfg) {
        for await (const items of it.asyncBatch(cfg.batchSize, iterable)) {
          await collection.updateMany(valueOrFunc(item, cfg.query), items, cfg.options)
          yield * items
        }
      } else {
        for await (const item of iterable) {
          await collection.updateOne(valueOrFunc(item, cfg.query), item, cfg.options)
          yield item
        }
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
