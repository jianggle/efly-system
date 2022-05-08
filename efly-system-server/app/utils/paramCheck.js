const { ServiceException } = require('@app/utils/resModel')

function rulesCheck(params, key, rules) {
  params = {
    ...params
  }

  if (!requiredCheck()) {
    return false
  }
  typeCheck()
  lengthCheck()
  patternCheck()
  return true

  function requiredCheck() {
    if (rules.isRequired && !params.hasOwnProperty(key)) {
      throw `${key} 缺失`
    }
    if (!rules.isRequired && !params.hasOwnProperty(key)) {
      return false
    }
    return true
  }

  function patternCheck() {
    const pattern = rules.pattern
    if (!pattern) return
    if (!pattern instanceof RegExp) return
    if (new RegExp(pattern).test(params[key])) return
    throw `${key} 不合法`
  }

  function typeCheck() {
    const type = rules.type
    if (!type) return
    const fieldVal = params[key]
    if (['string', 'number', 'boolean'].includes(type) && typeof fieldVal === type) return
    if (type === 'object' && Object.prototype.toString.call(fieldVal) === '[object Object]') return
    if (type === 'array' && Object.prototype.toString.call(fieldVal) === '[object Array]') return
    if (type === 'date') {
      const value = new Date(fieldVal)
      if (typeof value.getTime === 'function' && typeof value.getMonth === 'function' && typeof value.getYear === 'function' && !isNaN(value.getTime())) return
    }
    throw `${key} 类型不合法`
  }

  function lengthCheck() {
    const min = rules.min ? rules.min : 0
    const max = rules.max ? rules.max : Infinity
    const type = rules.type
    let length = 0
    if (type === 'string' || type === 'array') {
      length = params[key].length
    }
    if (type === 'number') {
      length = params[key]
    }
    if (length < min || length > max) {
      throw `${key} 长度或大小不合法`
    }
  }
}

class paramCheck {
  constructor() {
    this.rules = {
      type: 'string'
    }
  }
  static async check(params, schema) {
    const fields = Object.keys(schema)
    try {
      for (let field of fields) {
        rulesCheck(params, field, schema[field].rules)
      }
    } catch (error) {
      throw new ServiceException(error)
    }
  }

  isRequired() {
    this.rules.isRequired = true
    return this
  }

  isString() {
    this.rules.type = 'string'
    return this
  }
  isNumber() {
    this.rules.type = 'number'
    return this
  }
  isBoolean() {
    this.rules.type = 'boolean'
    return this
  }
  isObject() {
    this.rules.type = 'object'
    return this
  }
  isArray() {
    this.rules.type = 'array'
    return this
  }
  isDate() {
    this.rules.type = 'date'
    return this
  }

  min(min) {
    this.rules.min = min
    return this
  }
  max(max) {
    this.rules.max = max
    return this
  }

  pattern(pattern) {
    this.rules.pattern = pattern
    return this
  }
  isPositiveInteger() {
    this.rules.pattern = /^[1-9]\d*$/
    return this
  }
  isPhone() {
    this.rules.pattern = /^1[3-9]\d{9}$/
    return this
  }
}

module.exports = paramCheck
