/**
 * 简易深拷贝
 * @description 完美实现可参考lodash的_.cloneDeep
 */
export function deepClone(source) {
  if (!source) return source
  if (typeof source === 'object') {
    const sourceCopy = source instanceof Array ? [] : {}
    for (const item in source) {
      sourceCopy[item] = typeof source[item] === 'object' ? deepClone(source[item]) : source[item]
    }
    return sourceCopy
  }
  return source
}

export function formatDate(value, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!value || value === '0000-00-00 00:00:00') return ''
  let val = value.toString()
  val = val.length === 10 ? val * 1000 : (val.length === 13 ? val * 1 : val)
  const dateObj = new Date(val); let result = fmt
  const obj = {
    'M+': dateObj.getMonth() + 1,
    'd+': dateObj.getDate(),
    'h+': dateObj.getHours(),
    'm+': dateObj.getMinutes(),
    's+': dateObj.getSeconds(),
    'q+': Math.floor((dateObj.getMonth() + 3) / 3),
    'S': dateObj.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    const [fmt_year] = fmt.match(/(y+)/)
    result = result.replace(fmt_year, (dateObj.getFullYear() + '').substring(4 - fmt_year.length))
  }
  for (const key in obj) {
    const rule = new RegExp('(' + key + ')')
    if (rule.test(result)) {
      const [fmt_matched] = fmt.match(rule)
      result = result.replace(fmt_matched, (fmt_matched.length === 1) ? (obj[key]) : (('00' + obj[key]).substring(('' + obj[key]).length)))
    }
  }
  return result
}

export function delaySomeTime(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce(func, delay = 300) {
  let timer = null
  return function() {
    const self = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function() {
      func.apply(self, args)
    }, delay)
  }
}

export function throttle(func, delay = 300) {
  let statTime = 0
  return function() {
    const currTime = +new Date()
    if (currTime - statTime > delay) {
      func.apply(this, arguments)
      statTime = currTime
    }
  }
}
