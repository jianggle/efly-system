export function isExternal(path: string) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function aliasValidator(rule: any, value: string, callback: Function) {
  if (value && /^[0-9]+$/.test(value)) {
    callback(new Error('不能为纯数字'))
  } else {
    callback()
  }
}
