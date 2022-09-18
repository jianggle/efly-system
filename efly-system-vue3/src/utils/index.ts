/**
 * 简易深拷贝
 * @description 完美实现可参考lodash的_.cloneDeep
 */
export function deepClone(source: any) {
  if (!source) return source
  if (typeof source === 'object') {
    const sourceCopy = source instanceof Array ? [] : {}
    for (const item in source) {
      sourceCopy[item] =
        typeof source[item] === 'object'
          ? deepClone(source[item])
          : source[item]
    }
    return sourceCopy
  }
  return source
}

export function formatDate(value: any, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!value || value === '0000-00-00 00:00:00') return ''
  let val = value.toString()
  val = /^\d{10}$/.test(val) ? val * 1000 : /^\d{13}$/.test(val) ? val * 1 : val
  const dateObj = new Date(val)
  const obj = {
    'M+': dateObj.getMonth() + 1,
    'd+': dateObj.getDate(),
    'h+': dateObj.getHours(),
    'm+': dateObj.getMinutes(),
    's+': dateObj.getSeconds(),
    'q+': Math.floor((dateObj.getMonth() + 3) / 3),
    S: dateObj.getMilliseconds(),
  }
  if (Object.values(obj).includes(NaN)) return 'Invalid Date'
  let result = fmt
  const matchedYear = fmt.match(/(y+)/)
  if (matchedYear !== null) {
    const fmt_year = matchedYear[0]
    result = result.replace(
      fmt_year,
      (dateObj.getFullYear() + '').substring(4 - fmt_year.length)
    )
  }
  for (const key in obj) {
    const rule = new RegExp('(' + key + ')')
    const matchedRes = fmt.match(rule)
    if (matchedRes !== null) {
      const matched_res = matchedRes[0]
      result = result.replace(
        matched_res,
        matched_res.length === 1
          ? obj[key]
          : ('00' + obj[key]).substring(('' + obj[key]).length)
      )
    }
  }
  return result
}

export function delaySomeTime(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
