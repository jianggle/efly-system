const mysql = require('mysql')
const { dbConfig } = require('../config')

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

const formatToCamel = (arr) => {
  let res = []
  arr.forEach(item => {
    let newItem = {}
    for (let key in item) {
      newItem[key.replace(/_(\w)/g, ($0, $1) => $1.toLocaleUpperCase())] = item[key]
    }
    res.push(newItem)
  })
  return res
}

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
