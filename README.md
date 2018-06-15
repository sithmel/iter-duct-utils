iter-duct-utils
---------------
Useful pipeline segments for iter-duct.

logger
------
It logs the current item.
```js
{
  template: (obj) => 'Working on ${obj._id}'
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

map
---
It gets an input object and map into another
```js
(obj) => ({
    item1: obj[0],
    item2: obj[1],
  })
```

filter
------
It filters objects from a sequence
```js
(obj) => (obj.prop === 10)
```

throttle
--------
It ensures that a sequence doesn't return more than one item for an interval of time.
Note: the pipeline speed is already determined by the slowest item. This will slow down even more.
```js
{
  ms: 100
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
It reads json
```js
{
  files: '*.json',
}
```

json-writer
-----------
It writes json
```js
{
  filenames: '${this._id}.json',
}
```
