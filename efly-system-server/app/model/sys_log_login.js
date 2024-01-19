import BaseModel from '#utils/db_orm.js'
import { dbTables } from '#config/index.js'

class LogModel extends BaseModel {
  constructor() {
    super(dbTables.SYSTEM_LOG_LOGIN)
  }

  getList({ offset, limit, status, keyword, ipaddr, timeStart, timeEnd, online = false }) {
    const where = {},
      whereArr = []
    if (['0', '1'].includes(status)) {
      where['status'] = status
    }

    if (online) {
      where['online'] = 0
    }
    if (ipaddr) {
      where['ipaddr'] = ipaddr
    }
    if (keyword) {
      whereArr.push(`(user_name like '%${keyword}%')`)
    }
    if (timeStart && timeEnd) {
      whereArr.push(`login_time >= '${timeStart}'`)
      whereArr.push(`login_time < '${timeEnd}'`)
    }

    if (whereArr.length) {
      where['+'] = whereArr.join(' and ')
    }

    return this.findAndCountAll({
      where,
      offset,
      limit,
      order: 'login_id DESC',
    })
  }

  getListByUserName(userName, offset, limit) {
    return this.findAndCountAll({
      where: { userName },
      offset,
      limit,
      order: 'login_id DESC',
    })
  }

  getOneByToken(token) {
    return this.findOne({
      where: { token },
    })
  }

  outTokenStatusBySelf(token) {
    return this.update({ online: 1 }, { token })
  }
}

export default new LogModel()
