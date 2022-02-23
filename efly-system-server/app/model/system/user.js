const TableModel = require('@app/model/table-model')
const { dbTables } = require('@app/config')

class UserModel extends TableModel {
  constructor() {
    super(dbTables.SYSTEM_USER)
  }

  getUsers(status, keyword, offset, limit) {
    const where = {
      del_flag: 0,
    }
    if (['0', '1'].includes(status)) {
      where['status'] = status
    }
    if (keyword) {
      where['+'] = `(user_name like '%${keyword}%' or real_name like '%${keyword}%' or phone like '%${keyword}%')`
    }
    return this.findAndCountAll({
      where,
      offset,
      limit,
      order: {
        user_id: 'DESC',
      }
    })
  }

  getUserById(userId) {
    return this.findOne({
      where: {
        user_id: userId,
        del_flag: 0
      }
    })
  }

  getUserByName(userName) {
    return this.findOne({
      where: {
        user_name: userName,
        del_flag: 0
      }
    })
  }

  updateUser(userId, params) {
    return this.update(params, {
      user_id: userId
    })
  }

  updateUserLoginRecord(userId, ip) {
    return this.update({
      login_date: new Date(),
      login_ip: ip
    }, {
      user_id: userId
    })
  }

  updateUserDelFlag(userId) {
    return this.update({
      del_flag: 1
    }, {
      user_id: userId
    })
  }

  updateUserAvatar(userId, avatar) {
    return this.update({
      avatar
    }, {
      user_id: userId
    })
  }

  updateUserSetting(userId, setting) {
    return this.update({
      setting
    }, {
      user_id: userId
    })
  }

  updateUserPassword(userId, password) {
    return this.update({
      password
    }, {
      user_id: userId
    })
  }
}

module.exports = new UserModel()
