import BaseModel from '#utils/db_orm.js'
import { dbTables } from '#config/index.js'

class UserModel extends BaseModel {
  constructor() {
    super(dbTables.SYSTEM_USER)
  }

  getList(status, keyword, offset, limit) {
    const where = {
      del_flag: 0,
    }
    if (['0', '1'].includes(status)) {
      where['status'] = status
    }
    if (keyword) {
      where['+'] =
        `(user_name like '%${keyword}%' or real_name like '%${keyword}%' or phone like '%${keyword}%')`
    }
    return this.findAndCountAll({
      where,
      offset,
      limit,
      order: 'user_id DESC',
    })
  }

  getOne(userId) {
    return this.findOne({
      where: {
        userId,
        del_flag: 0,
      },
    })
  }
}

export default new UserModel()
