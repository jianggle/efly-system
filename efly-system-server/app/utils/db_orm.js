import { query } from './db.js'
import {
  formatToUnderline,
  formatWhere,
  formatOrder,
  formatAttributes,
  formatLeftJoin,
} from './db_utils.js'

class BaseModel {
  constructor(table) {
    this.table = table
    this.query = query
  }

  /**
   * 创建一条记录
   * @param {Object} fields fields对象
   * @param {Function} [tx] 事务执行器（由 withTransaction 提供，缺省走连接池）
   * @return {Promise}
   **/
  create(fields = {}, tx) {
    const params = formatToUnderline(fields)
    return (tx || this.query)(`INSERT INTO ${this.table} SET ?`, [params])
  }

  /**
   * 删除符合条件的记录
   * @param {Object} where where对象
   * @param {Function} [tx] 事务执行器（由 withTransaction 提供，缺省走连接池）
   * @return {Promise}
  **/
  destroy(where = {}, tx) {
    return (tx || this.query)(`DELETE FROM ${this.table} ${formatWhere(where)}`)
  }

  /**
   * 更新符合条件的记录
   * @param {Object} fields fields对象
   * @param {Object} where where对象
   * @param {Function} [tx] 事务执行器（由 withTransaction 提供，缺省走连接池）
   * @return {Promise}
  **/
  update(fields = {}, where = {}, tx) {
    const params = formatToUnderline(fields)
    return (tx || this.query)(`UPDATE ${this.table} SET ? ${formatWhere(where)}`, [params])
  }

  /**
   * 查询符合条件的一条记录
   * @param {Function} [tx] 事务执行器（由 withTransaction 提供，缺省走连接池）
   * @return {Promise} Object or null
  **/
  async findOne({ attributes = [], where = {}, order = '', join = [] } = {}, tx) {
    const isJoin = Array.isArray(join) && !!join.length
    let whereStr = formatWhere(where)
    let orderStr = formatOrder(order)
    let attributeStr = formatAttributes(attributes, isJoin)
    let res = []
    if (isJoin) {
      const [joinSql, joinAttribute] = formatLeftJoin(this.table, join)
      attributeStr += joinAttribute
      res = await (tx || this.query)(`SELECT ${attributeStr} FROM ${joinSql} ${whereStr} ${orderStr} LIMIT 1`)
    } else {
      res = await (tx || this.query)(`SELECT ${attributeStr} FROM ${this.table} ${whereStr} ${orderStr} LIMIT 1`)
    }
    return res.length ? res[0] : null
  }

  /**
   * 查询符合条件的所有记录
   * @return {Promise} Array
  **/
  findAll({ attributes = [], where = {}, order = '', join = [] } = {}) {
    const isJoin = Array.isArray(join) && !!join.length
    let whereStr = formatWhere(where)
    let orderStr = formatOrder(order)
    let attributeStr = formatAttributes(attributes, isJoin)
    if (isJoin) {
      const [joinSql, joinAttribute] = formatLeftJoin(this.table, join)
      attributeStr += joinAttribute
      return query(`SELECT ${attributeStr} FROM ${joinSql} ${whereStr} ${orderStr}`)
    } else {
      return query(`SELECT ${attributeStr} FROM ${this.table} ${whereStr} ${orderStr}`)
    }
  }

  /**
   * 查询符合条件的记录并分页
   * @return {Promise} Object
  **/
  async findAndCountAll({
    attributes = [],
    where = {},
    order = '',
    offset = 0,
    limit = 6,
    join = [],
  } = {}) {
    const isJoin = Array.isArray(join) && !!join.length
    let whereStr = formatWhere(where)
    let orderStr = formatOrder(order)
    let attributeStr = formatAttributes(attributes, isJoin)
    let countSql = `SELECT count(*) FROM ${this.table} AS a ${whereStr}`
    let rows = []
    if (isJoin) {
      const [joinSql, joinAttribute] = formatLeftJoin(this.table, join)
      attributeStr += joinAttribute
      // 带join查询时，count也需要join才能保证条件一致
      countSql = `SELECT count(*) FROM ${joinSql} ${whereStr}`
      rows = await query(`SELECT ${attributeStr} FROM ${joinSql} ${whereStr} ${orderStr} LIMIT ${offset},${limit}`)
    } else {
      rows = await query(`SELECT ${attributeStr} FROM ${this.table} ${whereStr} ${orderStr} LIMIT ${offset},${limit}`)
    }
    const count = await query(countSql)
    return {
      count: count[0]['count(*)'],
      rows,
    }
  }
}

export default BaseModel
