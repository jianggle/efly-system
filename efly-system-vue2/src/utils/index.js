/**
 * 简易深拷贝
 * @description 完美实现可参考lodash的_.cloneDeep
 */
export function deepClone(source) {
  if (!source) return source
  if (typeof source === 'object') {
    let sourceCopy = source instanceof Array ? [] : {}
    for (let item in source) {
      sourceCopy[item] = typeof source[item] === 'object' ? deepClone(source[item]) : source[item]
    }
    return sourceCopy
  }
  return source
}

export function formatDate(value, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!value || value === '0000-00-00 00:00:00') return ''
  let val = value.toString()
  val = val.length == 10 ? val * 1000 : (val.length == 13 ? val * 1 : val)
  let dateObj = new Date(val), result = fmt;
  let obj = {
    'M+': dateObj.getMonth() + 1,
    'd+': dateObj.getDate(),
    'h+': dateObj.getHours(),
    'm+': dateObj.getMinutes(),
    's+': dateObj.getSeconds(),
    'q+': Math.floor((dateObj.getMonth() + 3) / 3),
    'S': dateObj.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) {
    let [fmt_year] = fmt.match(/(y+)/)
    result = result.replace(fmt_year, (dateObj.getFullYear() + '').substring(4 - fmt_year.length))
  }
  for (let key in obj) {
    let rule = new RegExp('(' + key + ')')
    if (rule.test(result)) {
      let [fmt_matched] = fmt.match(rule)
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
  return function () {
    let self = this, args = arguments;
    clearTimeout(timer)
    timer = setTimeout(function () {
      func.apply(self, args)
    }, delay)
  }
}

export function throttle(func, delay = 300) {
  let statTime = 0
  return function () {
    let currTime = +new Date()
    if (currTime - statTime > delay) {
      func.apply(this, arguments)
      statTime = currTime
    }
  }
}
