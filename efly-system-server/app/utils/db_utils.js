/**
 * 将对象中为小驼峰的key转化为下划线连接的形式，如userId会变成user_id
 * @param {Object} obj
 * @return {Object} Object
 **/
function formatToUnderline(obj = {}) {
  const newObj = {}
  for (const key in obj) {
    newObj[key.replace(/([A-Z])/g, ($0, $1) => '_' + $1.toLowerCase())] = obj[key]
  }
  return newObj
}

/**
 * 格式化字段为小驼峰形式，如user_id会变成userId
 * @param {Array} arr
 * @return {Array} Array
 **/
function formatToCamel(arr) {
  const res = []
  arr.forEach(item => {
    let newItem = {}
    for (let key in item) {
      newItem[key.replace(/_(\w)/g, ($0, $1) => $1.toLocaleUpperCase())] = item[key]
    }
    res.push(newItem)
  })
  return res
}

/**
 * 格式化where对象为对应的sql语句
 * @description key为+时将直接拼接为and val，val为Array时拼接为and key in (val)，否则为and key=val
 * @param {Object} obj where对象，小驼峰的key将自动转化为下划线连接的形式，如userId会变成user_id
 * @return {String}
 **/
function formatWhere(obj = {}) {
  const arr = []
  obj = formatToUnderline(obj)
  for (const key in obj) {
    const val = obj[key]
    if (key === '+') {
      arr.push(val)
    } else if (Array.isArray(val)) {
      arr.push(`${key} in (${val.toString()})`)
    } else {
      arr.push(`${key}='${val}'`)
    }
  }
  return !!arr.length ? ' where ' + arr.join(' and ') : ''
}

/**
 * 格式化order为对应的sql语句
 * @param {Any} params 形如'a desc,b asc'或[['a', 'desc'],['b','asc']]
 * @return {String}
 **/
function formatOrder(params) {
  if (!params) return ''
  let str = ''
  if (typeof params === 'string') {
    str = params
  } else if (Array.isArray(params)) {
    str = params.map(item => item.join(' ')).join(',')
  }
  return str ? ` order by ${str}` : ''
}

/**
 * 格式化attribute为对应的sql语句
 * @param {Array} arr 要查询字段的数组
 * @param {Boolean} isJoin 是否使用了join
 * @return {String}
 **/
function formatAttributes(arr = [], isJoin = false) {
  if (!isJoin) {
    return String(arr) || '*'
  }
  let attrs = arr.map(item => 'a.' + item)
  return String(attrs)
}

/**
 * 格式化left join为对应的sql语句
 * @param {String} curTable 主表名称
 * @param {Array} arr 关联表配置的数组
 * @return {Array} [joinSql, attributeStr]
 **/
function formatLeftJoin(curTable, arr = []) {
  let joinSql = '', attributeStr = ''
  arr.forEach((item, index) => {
    for (let key in item.attributes) {
      attributeStr += `,${item.table}.${key} AS ${item.attributes[key]}`
    }
    let newJoin = `LEFT JOIN ${item.table} AS ${item.table} ON a.${item.primaryKey}=${item.table}.${item.foreignKey}`
    if (index === 0) {
      joinSql += `${curTable} AS a ${newJoin}`
    } else {
      joinSql = `(${joinSql}) ${newJoin}`
    }
  })
  return [joinSql, attributeStr]
}

module.exports = {
  formatToUnderline,
  formatToCamel,
  formatWhere,
  formatOrder,
  formatAttributes,
  formatLeftJoin,
}
