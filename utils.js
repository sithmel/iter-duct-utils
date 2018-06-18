const it = require('iter-tools')

function valueOrFunc (obj, func) {
  if (typeof func === 'function') {
    return func(obj)
  }
  return func
}

function splitCSVRow (row) {
  const colSplitter = it.regexpExec(/(?:^|,)(\"(?:[^\"]+|\"\")*\"|[^,]*)/g)
  const unwrapQuote = (field) => {
    const match = /^"?([^"]*)"?$/.exec(field)
    if (match) return match[1]
    return ''
  }
  const firstGroup = it.map((match) => match[1])
  const unwrap = it.map(unwrapQuote)
  return Array.from(unwrap(firstGroup(colSplitter(row))))
}

module.exports = {
  valueOrFunc,
  splitCSVRow
}
