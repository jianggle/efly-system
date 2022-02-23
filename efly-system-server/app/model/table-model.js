const { query } = require('./db')

const formatWhere = (params = {}) => {
  let arr = []
  for (let key in params) {
    let val = params[key]
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

const formatOrder = (params = {}) => {
  let arr = []
  for (let key in params) {
    arr.push(`${key} ${params[key]}`)
  }
  return !!arr.length ? ' order by ' + arr.join(',') : ''
}

const formatAttributes = (arr = [], isJoin = false) => {
  if (!isJoin) {
    return String(arr) || '*'
  }
  let attrs = arr.map(item => 'a.' + item)
  return String(attrs)
}

const formatLeftJoin = (curTable, arr = []) => {
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

const formatToUnderline = (obj) => {
  let newObj = {}
  for (let key in obj) {
    newObj[key.replace(/([A-Z])/g, ($0, $1) => '_' + $1.toLowerCase())] = obj[key]
  }
  return newObj
}

class TableModel {
  constructor(table) {
    this.table = table
    this.query = query
  }

  create(params) {
    params = formatToUnderline(params)
    return query(`INSERT INTO ?? SET ?`, [this.table, params])
  }

  destroy(where) {
    return query(`DELETE FROM ?? ${formatWhere(where)}`, [this.table])
  }

  update(params, where) {
    params = formatToUnderline(params)
    return query(`UPDATE ?? SET ? ${formatWhere(where)}`, [this.table, params])
  }

  async findOne({
    attributes,
    where,
    join = [],
  } = {}) {
    const isJoin = Array.isArray(join) && !!join.length
    let whereStr = formatWhere(where)
    let attributeStr = formatAttributes(attributes, isJoin)
    let res = []
    if (isJoin) {
      const [joinSql, joinAttribute] = formatLeftJoin(this.table, join)
      attributeStr += joinAttribute
      res = await query(`SELECT ${attributeStr} FROM ${joinSql} ${whereStr} LIMIT 1`)
    } else {
      res = await query(`SELECT ${attributeStr} FROM ${this.table} ${whereStr} LIMIT 1`)
    }
    return res.length ? res[0] : null
  }

  findAll({
    attributes,
    where,
    order,
  } = {}) {
    return query(`SELECT ${formatAttributes(attributes)} FROM ?? ${formatWhere(where)} ${formatOrder(order)}`, [this.table])
  }

  async findAndCountAll({
    attributes,
    where,
    offset,
    limit,
    order,
    join = [],
  }) {
    const isJoin = Array.isArray(join) && !!join.length
    let whereStr = formatWhere(where)
    let orderStr = formatOrder(order)
    let attributeStr = formatAttributes(attributes, isJoin)
    let count = await query(`SELECT count(*) FROM ${this.table} AS a ${whereStr}`)
    let rows = []
    if (isJoin) {
      const [joinSql, joinAttribute] = formatLeftJoin(this.table, join)
      attributeStr += joinAttribute
      rows = await query(`SELECT ${attributeStr} FROM ${joinSql} ${whereStr} ${orderStr} LIMIT ${offset},${limit}`)
    } else {
      rows = await query(`SELECT ${attributeStr} FROM ${this.table} ${whereStr} ${orderStr} LIMIT ${offset},${limit}`)
    }
    return {
      count: count[0]['count(*)'],
      rows
    }
  }
}

module.exports = TableModel
