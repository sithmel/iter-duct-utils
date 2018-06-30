function passThrough () {
  return function (iterable) {
    return iterable
  }
}

module.exports = passThrough
