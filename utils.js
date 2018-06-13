function valueOrFunc(obj, func) {
  if (typeof func === 'function') {
    return func(obk)
  }
  return func
}

module.exports = {
  valueOrFunc
}
