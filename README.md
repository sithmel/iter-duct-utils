iter-duct-utils
===============
Useful pipeline segments for [iter-duct](https://github.com/tes/iter-duct).

How to read the documentation
-----------------------------
For each segment there is a description, the type of segment (reader, transformer or writer) and the configuration.
When specified "value or function", the config parameter can get a function that takes as argument the current item returned by the iterable.

Types of segment
----------------
* Reader: it reads the data somewhere, it ignores the iterable in input
* Transformer: it takes the iterable in input and returns another as output
* Writer: it writes the data somewhere
* Special: it implements some special feature

All types returns an iterable, even the "writer" let the iterable in input pass through unchanged.

iter-tools transformers
-----------------------
**type**: transformer

[iter-tools](https://github.com/sithmel/iter-tools) includes many useful pipeline segments. Here are some examples:

```js
const it = require('iter-tools/es2018')

// map every item to a new object
it.asyncMap((obj) => ({ fullname: `${obj.firstname} ${obj.lastname}` }))

// filter out all items that returns false
it.asyncFilter((obj) => obj.include)

// it filters all items before the function is true for the first time
it.asyncTakeWhile((obj) => obj.include)

// it drops all items after the function returns true for the first time
it.asyncDropWhile((obj) => obj.exclude)

// slice the iterable (you can define start, end and step)
it.asyncSlice({ start: 1 })

// it generate multiple items from a single one
it.asyncFlatMap((item) => [item, { ... item, clone: true }])

// throttle iterables to 1 sec for each
it.asyncThrottle(1000)
```

You can find how they work in [iter-tools](https://github.com/sithmel/iter-tools) documentation.
For example:
```js
const it = require('iter-tools/es2018')
const pipeline = [
  ...
  itools.asyncMap((item) => { ... })
  ...
]
```

logger
------
**type**: writer

It logs the current item.
Arguments:
* template: **string or function**

mongo-reader
------------
**type**: reader/transformer

It runs a "find" query on mongo and returns the results.
If this receives an iterable, it can run a "find" query for each item.

* host: mongo host, example 'mongodb01-az1.live.xxx.com' **string**
* user: example 'resource_xxx' **string**
* password: example: 'xxx' **string**
* collection: collection name, example 'resources' **string**
* authDb: db used for authentication **string**
* db: database name, example 'resource' **string**
* query: find query, example{ authorId: 123 } **object or function**

mongo-update
------------
**type**: writer

It updates a document in a mongo collection (using collection.updateOne from the [mongodb](https://www.npmjs.com/package/mongodb) library). It returns the same object.

* host: mongo host, example 'mongodb01-az1.live.xxx.com' **string**
* user: example 'resource_xxx' **string**
* password: example: 'xxx' **string**
* collection: collection name, example 'resources' **string**
* db: database name, example 'resource' **string**
* authDb: db used for authentication **string**
* query: find query, example{ authorId: 123 } **object or function**
* doc: an object containing the fields to update **object or function**
* options: options for the "updateOne" method **object or function**

mongo-insert
------------
**type**: writer

It adds a document in a mongo collection (using collection.insertOne from the [mongodb](https://www.npmjs.com/package/mongodb) library). It returns the same object.

* host: mongo host, example 'mongodb01-az1.live.xxx.com' **string**
* user: example 'resource_xxx' **string**
* password: example: 'xxx' **string**
* collection: collection name, example 'resources' **string**
* db: database name, example 'resource' **string**
* authDb: db used for authentication **string**
* doc: an object containing the fields to update **object or function**
* options: options for the "insertOne" method **object or function**

csv-reader
----------
**type**: reader

It reads a csv and returns an item for each row (as array of objects).
It can take all options of csv-parse: https://www.npmjs.com/package/csv-parse

* filename: the csv file name, example 'file.csv' **string**
* encoding: CSV encoding. It defaults to utf8 **string**
* ...see: https://www.npmjs.com/package/csv-parse

csv-writer
----------
**type**: writer

It writes a csv, line by line.
It can take all options of csv-write-stream: https://www.npmjs.com/package/csv-write-stream

* filename: the csv file name, example 'file.csv' **string**
* ...see: https://www.npmjs.com/package/csv-write-stream

download
--------
**type**: writer

It downloads a file for each iterable.

* url: **string or function**
* filename: '**string or function**
* skipExisting: (default false)
* concurrency: (default 4)

getJSON
-------
**type**: reader

It reads a json from an url and push it into the pipeline

* url: **string or function**
* headers: HTTP headers **object or function**
* concurrency: (default 4)

postJSON
--------
**type**: writer

It writes a json and push the result into the pipline

* url: **string or function**
* payload: **object or function**
* headers: HTTP headers **object or function**
* method: (default 'POST') **string**
* concurrency: (default 4)

postForm
--------
**type**: writer

It writes a file to an endpoint (uses multipart/formdata).

* url: **string or function**
* formData: **object or function**
* headers: HTTP headers **object or function**
* method: (default 'POST') **string**
* concurrency: (default 4)

formData should return an array of objects with this shape:
```js
[
  {
    name: 'field1',
    value: 'xxx'
  },
  {
    name: 'field2',
    value: 'yyy'
  },
  {
    name: 'file',
    value: path.join(__dirname, './test.jpg'),
    options: { contentType: 'image/jpeg', filename: 'test.jpg' },
    attachment: true
  }
]
```

json-reader
-----------
**type**: reader

It reads a json

* files: a path using globbing **string**

json-writer
-----------
**type**: writer

It writes a json file for each item.

* filename: json path name **value or string**

readfile
--------
**type**: reader

It reads a file and either split it or return matches

* filename: path name **value or string**
* split: regexp to split the text **regexp**
* extract: regexp to extract text from a file **regexp**

exec
----
**type**: reader

It runs a command and reads standard output, then it either split it or return matches:

* cmd: command to run **value or string**
* split: regexp to split the output **regexp**
* extract: regexp to extract text from the output **regexp**
