iter-duct-utils
---------------
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

All types returns an iterable, even the "writer" let the iterable in input pass through unchanged.

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

map
---
**type**: transformer
It gets an input object and map into another
* func: **function**

filter
------
**type**: transformer
It filters objects from a sequence
* func: if this function returns false, the item is removed from the sequence **function**

slice
-----
**type**: transformer
It slices the sequence.
* start: removes the first n items from the sequence (default 0)
* end: cut the sequence after the item number x (default Infinity)

throttle
--------
**type**: N/A
It ensures that a sequence doesn't return more than one item for an interval of time.
Note: the pipeline speed is already determined by the slowest item. This will slow down even more.
* ms number of milliseconds **number**

download
--------
**type**: writer
It downloads a file for each iterable.
* url: **value or string**
* filename: '**value or string**
* skipExisting: (default false)
* concurrency: (default 4)

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
