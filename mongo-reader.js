const { valueOrFunc, getMongoClient } = require('./utils')
// {
//   host: 'mongodb01-az1.live.xxx.com',
//   user: 'resourcexxx',
//   password: 'xxx',
//   collection: 'resourcesxxx',
//   db: 'resource',
//   query: { authorId: 2127200 }
// }

function getMongoReader (cfg) {
  return async function * (iterable) {
    let client
    try {
      client = await getMongoClient(cfg)
      const db = client.db(cfg.db)
      const collection = db.collection(cfg.collection)
      for await (const item of iterable || [{}]) {
        const cursor = collection.find(valueOrFunc(item, cfg.query) || {}) // .noCursorTimeout();
        while (await cursor.hasNext()) {
          const doc = await cursor.next()
          yield doc
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

module.exports = getMongoReader
