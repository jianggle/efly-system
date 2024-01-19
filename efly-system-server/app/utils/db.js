import mysql from 'mysql'
import { dbConfig } from '#config/index.js'
import { formatToCamel } from './db_utils.js'

const pool = mysql.createPool(dbConfig)

const connectHandler = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err)
      } else {
        resolve(connection)
      }
    })
  })
}

export const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    connectHandler()
      .then((connection) => {
        connection.query(sql, values, (error, results, fields) => {
          connection.release()
          if (error) {
            reject(error)
          } else {
            if (!Array.isArray(results)) {
              resolve(results)
            } else {
              let newResults = formatToCamel(results)
              resolve(newResults)
            }
          }
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}
