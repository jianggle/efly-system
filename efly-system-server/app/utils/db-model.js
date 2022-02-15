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

const formatAttributes = (a = [], b = {}) => {
  if (!Object.keys(b).length) {
    return String(a) || '*'
  }
  let attrs = a.map(item => 'a.' + item)
  for (let key in b) {
    attrs.push(`b.${key} AS ${b[key]}`)
  }
  return String(attrs)
}

const formatToUnderline = (obj) => {
  let newObj = {}
  for (let key in obj) {
    newObj[key.replace(/([A-Z])/g, ($0, $1) => '_' + $1.toLowerCase())] = obj[key]
  }
  return newObj
}

class DbModel {
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
    join = {},
  } = {}) {
    let whereStr = formatWhere(where)
    let attributeStr = formatAttributes(attributes, join.attributes)
    let res = []
    if (!Object.keys(join).length) {
      res = await query(`SELECT ${attributeStr} FROM ${this.table} ${whereStr} LIMIT 1`)
    } else {
      let joinStr = `AS a LEFT JOIN ${join.table} AS b ON a.${join.primaryKey}=b.${join.foreignKey}`
      res = await query(`SELECT ${attributeStr} FROM ${this.table} ${joinStr} ${whereStr} LIMIT 1`)
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
    join = {},
  }) {
    let whereStr = formatWhere(where)
    let orderStr = formatOrder(order)
    let attributeStr = formatAttributes(attributes, join.attributes)
    let count = await query(`SELECT count(*) FROM ${this.table} AS a ${whereStr}`)
    let rows = []
    if (!Object.keys(join).length) {
      rows = await query(`SELECT ${attributeStr} FROM ${this.table} ${whereStr} ${orderStr} LIMIT ${offset},${limit}`)
    } else {
      let joinStr = `AS a LEFT JOIN ${join.table} AS b ON a.${join.primaryKey}=b.${join.foreignKey}`
      rows = await query(`SELECT ${attributeStr} FROM ${this.table} ${joinStr} ${whereStr} ${orderStr} LIMIT ${offset},${limit}`)
    }
    return {
      count: count[0]['count(*)'],
      rows
    }
  }
}

module.exports = DbModel
