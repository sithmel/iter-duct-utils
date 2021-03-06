const { valueOrFunc, getMongoClient } = require('./utils')
const it = require('iter-tools/es2018')
const { getLogger } = require('iter-duct')

// {
//   host: 'mongodb01-az1.live.xxx.com',
//   user: 'resourcexxx',
//   password: 'xxx',
//   collection: 'resourcesxxx',
//   db: 'resource',
//   doc: { authorId: 2127200 }
// }

function getMongoUpdate (cfg) {
  const logger = getLogger()
  return async function * (iterable) {
    let client
    try {
      client = await getMongoClient(cfg)
      const db = client.db(cfg.db)
      const collection = db.collection(cfg.collection)
      if ('batchSize' in cfg) {
        for await (const items of it.asyncBatch(cfg.batchSize, iterable)) {
          logger.log({ level: 'debug', message: 'mongoUpdate update many', item: items })
          await collection.updateMany(valueOrFunc(items, cfg.query), valueOrFunc(items, cfg.doc), valueOrFunc(items, cfg.options))
          yield * items
        }
      } else {
        for await (const item of iterable) {
          logger.log({ level: 'debug', message: 'mongoUpdate update one', item })
          await collection.updateOne(valueOrFunc(item, cfg.query), valueOrFunc(item, cfg.doc), valueOrFunc(item, cfg.options))
          yield item
        }
      }
    } catch (error) {
      logger.log({ level: 'error', message: 'error updating mongo', error })
      throw error
    } finally {
      if (client) {
        client.close()
      }
    }
  }
}

module.exports = getMongoUpdate
