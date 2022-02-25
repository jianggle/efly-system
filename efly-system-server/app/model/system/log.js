const TableModel = require('@app/model/table-model')
const { dbTables } = require('@app/config')

class LogModel extends TableModel {
  constructor() {
    super(dbTables.SYSTEM_LOG_LOGIN)
  }

  addLoginLog(params) {
    return this.create(params)
  }

  getLoginLogs(offset, limit, status, keyword, time_start, time_end) {
    const where = {}, whereArr = []
    if (['0', '1'].includes(status)) {
      where['status'] = status
    }

    if (keyword) {
      whereArr.push(`(user_name like '%${keyword}%')`)
    }
    if (time_start && time_end) {
      whereArr.push(`login_time >= '${time_start}'`)
      whereArr.push(`login_time < '${time_end}'`)
    }

    if (whereArr.length) {
      where['+'] = whereArr.join(' and ')
    }

    return this.findAndCountAll({
      where,
      offset,
      limit,
      order: 'login_id DESC'
    })
  }

  getLoginLogByUserName(userName, offset, limit) {
    return this.findAndCountAll({
      where: {
        user_name: userName
      },
      offset,
      limit,
      order: 'login_id DESC'
    })
  }

  clearLoginLog() {
    return this.query(`TRUNCATE ${this.table}`)
  }

  getLoginLogById(logId) {
    return this.findOne({
      where: {
        login_id: logId
      }
    })
  }
}

module.exports = new LogModel()
