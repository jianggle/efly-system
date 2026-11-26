import mysql from 'mysql2/promise'
import { dbConfig } from '#config/index.js'
import { formatToCamel } from './db_utils.js'

const pool = mysql.createPool(dbConfig)

// 统一连接会话时区，保证 DATE_FORMAT / NOW() 等时间函数按东八区计算
pool.on('connection', (conn) => {
  conn.query(`SET time_zone = '+08:00'`)
})

const formatResult = (results) => {
  if (!Array.isArray(results)) return results
  return formatToCamel(results)
}

export const query = async (sql, values) => {
  const [results] = await pool.query(sql, values)
  return formatResult(results)
}

/**
 * 事务：fn 接收一个与 query 同签名的执行器 tx，任一步骤抛错则整体回滚
 * @param {Function} fn 业务函数
 * @return {Promise}
 **/
export const withTransaction = async (fn) => {
  const conn = await pool.getConnection()
  const tx = async (sql, values) => {
    const [results] = await conn.query(sql, values)
    return formatResult(results)
  }
  try {
    await conn.beginTransaction()
    const result = await fn(tx)
    await conn.commit()
    return result
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}
