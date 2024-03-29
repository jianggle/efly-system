import { ServiceException } from '#utils/resModel.js'
import dayjs from 'dayjs'

class Validator {
  isPositiveInteger(val) {
    return /^[1-9]\d*$/.test(val)
  }

  isValidAccount(val) {
    return /^[0-9A-Za-z]{5,11}$/.test(val)
  }

  isValidCaptcha(val) {
    return /^[0-9A-Za-z]{4}$/.test(val)
  }

  isBoolean(val) {
    return typeof val === 'boolean'
  }

  isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }

  isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]'
  }

  isObjIncludeKey(obj = {}, key) {
    return Object.keys(obj).includes(key)
  }

  isModify(ctx, key) {
    const params = ctx.request.body
    const isUpdate = this.isObjIncludeKey(params, key)
    if (isUpdate) {
      if (!this.isPositiveInteger(params[key])) {
        throw new ServiceException(`${key} error`)
      }
      return true
    } else {
      return false
    }
  }

  formatPagingParams(ctx) {
    const params = ctx.request.method === 'GET' ? ctx.request.query : ctx.request.body
    let { currentPage, pageSize } = params
    if (!this.isPositiveInteger(currentPage)) {
      currentPage = 1
    }
    if (!this.isPositiveInteger(pageSize)) {
      pageSize = 12
    }
    const offset = (currentPage - 1) * pageSize
    return [offset, pageSize * 1, currentPage * 1]
  }

  formatAlias(val) {
    const alias = (val || '').trim().replace(/(\s+)/g, '-')
    if (/^[0-9]+$/.test(alias)) {
      throw new ServiceException('别名不能全为数字')
    }
    return alias
  }

  formatTimeRange(str = '') {
    let [timeStart, timeEnd] = str.split(',')
    if (timeStart && timeEnd) {
      timeStart = dayjs(Number(timeStart)).format('YYYY-MM-DD HH:mm:ss')
      timeEnd = dayjs(Number(timeEnd)).format('YYYY-MM-DD HH:mm:ss')
    } else {
      timeStart = timeEnd = null
    }
    return [timeStart, timeEnd]
  }
}

export default new Validator()
