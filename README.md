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
* db: database name, example 'resource' **string**
* query: find query, example{ authorId: 123 } **object or function**

csv-reader
----------
**type**: reader

It reads a csv and returns an item for each row (as array of array).
It often requires a "map" segment to map the array to an object.

* filename: the csv file name, example 'file.csv' **string**
* encoding: CSV encoding. It defaults to utf8 **string**

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
* concurrency: (default 4)

postJSON
--------
**type**: reader

It writes a json

* url: **string or function**
* payload: **object or function**
* concurrency: (default 4)
* method: (default 'POST')

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

pass-through
------------
**type**: special

This is a special segment that returns exactly what it gets in input

multiplex
---------
**type**: special

This special segment combines different segments and zip the results together:
```js
multiplex(map({ func: (item) => item * item }), map({ func: (item) => item * 2 }))
```
If the sequence returns [2, 4, 6], this will return:
```js
[4, 4]
[16, 8]
[36, 12]
```

tricks
======

#### Running multiple migration segments in parallel
Multiplex can be useful if you can run multiple migration segments at the same time:

```js
multiplex(getJSON({ ... }), jsonWriter({ ... }))
```

#### Retain the original sequence
or you can use passthrough to retain the original iterable:
```js
[
  ...  
  multiplex(getJSON({ ... }), passThrough()),
  asyncMap((pair) => ({
    ...pair[0], id: pair[1].id // I want to reuse the id from the original iterable
  }))
  ...
]
```

#### Start a pipeline with an array (or iterable)
If you want you can start your pipeline with any function that returns an iterable (synchronous or asynchronous):
```js
[
  () => [1, 2, 3, 4],
  getJSON({ url: (item) => `http://www.archive.com/item${item}`}),
  JSONWriter({ filename: (item) => `${item.id}.json`  })
]
```

#### How to generate random sequences
You can combine iter-tools execute and occamsrazor-generate
```js
const it = require('iter-tools/es2018')
const generate = require('occamsrazor-generate')
const chance = require('occamsrazor-generate/extra/chance')

// This returns an inifinite sequence of objects. Combine with slice to set a maximum size.
[
  itools.execure(generate({
    x: chance('integer', {min: -20, max: 20}),
    y: chance('integer', {min: -20, max: 20})
  })),
  ...
]
```
