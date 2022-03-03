const mysql = require('mysql')
const { dbConfig } = require('@app/config')
const { formatToCamel } = require('./db_utils')

const pool = mysql.createPool(dbConfig)

const connectHandler = () => new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err) {
      reject(err)
    } else {
      resolve(connection)
    }
  })
})

exports.query = (sql, values) => new Promise((resolve, reject) => {
  connectHandler().then(connection => {
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
  }).catch((err) => {
    reject(err)
  })
})
