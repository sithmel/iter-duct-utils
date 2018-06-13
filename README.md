iter-duct-utils
---------------
Useful pipeline segments for iter-duct.

logger
------
It logs the current item.
```js
{
  template: 'Working on ${this._id}'
}
```

mongo-reader
------------
It runs a "find" query on mongo and returns the results
```js
{
  host: 'mongodb01-az1.live.xxx.com',
  user: 'resource_xxx',
  password: 'xxx',
  collection: 'resources',
  db: 'resource',
  query: { authorId: 123 }
}
```

csv-reader
----------
It reads a csv and returns an item for each row
```js
{
  filename: 'file.csv',
}
```

download
--------
It downloads a file
```js
{
  skipExisting: false
  url: 'http://www.example.com/resource/${this._id}/bundle'
  filename: '${this._id}.zip'
  concurrency: 4
}
```

json-reader
-----------
It reads a json
```js
{
  files: '*.json',
}
```

json-writer
-----------
It writes a json
```js
{
  filenames: '${this._id}.json',
}
```
