const it = require('iter-tools/es2018')

function multiplex (...segments) {
  return function (iterable) {
    const iterables = it.asyncTee(iterable, segments.length)
    const segmentInstances = it.map(
      ([segment, iterable]) => segment(iterable),
      it.zip(segments, iterables))
    return it.asyncZip(...segmentInstances)
  }
}

module.exports = multiplex
