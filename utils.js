function valueOrFunc(obj, func) {
  if (typeof func === 'function') {
    return func(obj)
  }
  return func
}

module.exports = {
  valueOrFunc
}
