const { valueOrFunc, getMongoClient } = require('./utils')
const it = require('iter-tools')

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
  return async function * (iterable) {
    let client
    try {
      client = await getMongoClient(cfg)
      const db = client.db(cfg.db)
      const collection = db.collection(cfg.collection)
      if ('batchSize' in cfg) {
        for await (const items of it.asyncBatch(cfg.batchSize, iterable)) {
          await collection.insertMany(valueOrFunc(items, cfg.doc), valueOrFunc(items, cfg.options))
          yield * items
        }
      } else {
        for await (const item of iterable) {
          await collection.insertOne(valueOrFunc(item, cfg.doc), valueOrFunc(item, cfg.options))
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
