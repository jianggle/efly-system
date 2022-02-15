const { CustomException } = require('./custom-exception')

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
        throw new CustomException(`${key} error`)
      }
      return true
    } else {
      return false
    }
  }

  validatePagingParams(ctx) {
    const params = ctx.request.method === 'GET' ? ctx.request.query : ctx.request.body
    const { currentPage, pageSize } = params
    if (!this.isPositiveInteger(currentPage)) throw 'currentPage error'
    if (!this.isPositiveInteger(pageSize)) throw 'pageSize error'
    const offset = (currentPage - 1) * pageSize
    return [offset, pageSize * 1, currentPage * 1]
  }
}

module.exports = new Validator()
