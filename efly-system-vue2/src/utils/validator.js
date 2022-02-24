export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function aliasValidator(rule, value, callback) {
  if (value && /^[0-9]+$/.test(value)) {
    callback(new Error('不能为纯数字'))
  } else {
    callback()
  }
}
