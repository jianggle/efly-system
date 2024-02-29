import dayjs from 'dayjs'

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

export function formatDate(value, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!value || value === '0000-00-00 00:00:00') return ''
  let val = value.toString()
  val = /^\d{10}$/.test(val) ? val * 1000 : /^\d{13}$/.test(val) ? val * 1 : val
  return dayjs(val).format(fmt)
}

export function delaySomeTime(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function debounce(func, delay = 300) {
  let timer = null
  return function () {
    const self = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(function () {
      func.apply(self, args)
    }, delay)
  }
}

export function throttle(func, delay = 300) {
  let statTime = 0
  return function () {
    const currTime = +new Date()
    if (currTime - statTime > delay) {
      func.apply(this, arguments)
      statTime = currTime
    }
  }
}
