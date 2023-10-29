import dayjs from 'dayjs'

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

export function formatDate(value: any, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!value || value === '0000-00-00 00:00:00') return ''
  let val = value.toString()
  val = /^\d{10}$/.test(val) ? val * 1000 : /^\d{13}$/.test(val) ? val * 1 : val
  return dayjs(val).format(fmt)
}

export function delaySomeTime(ms = 200) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
