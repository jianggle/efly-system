const DbModel = require('../utils/db-model')

class RoleModel extends DbModel {
  constructor() {
    super('sys_role')
  }

  getSuperRoleId() {
    return 1
  }

  getRoles(simple = false) {
    return this.findAll({
      where: {
        del_flag: 0,
      },
      order: {
        create_time: 'DESC',
      },
      attributes: simple === true ? ['role_id', 'role_name'] : []
    })
  }

  getRoleById(roleId) {
    return this.findOne({
      where: {
        role_id: roleId,
        del_flag: 0
      }
    })
  }

  getRoleByName(roleName) {
    return this.findOne({
      where: {
        role_name: roleName,
        del_flag: 0
      }
    })
  }

  getRolesByIds(ids, justValid = false) {
    const where = {
      role_id: ids,
      del_flag: 0,
    }
    if (justValid === true) {
      where.status = 0
    }
    return this.findAll({
      attributes: ['role_name', 'role_menu'],
      where,
    })
  }

  updateRole(roleId, params) {
    return this.update(params, {
      role_id: roleId
    })
  }

  updateRoleDelFlag(roleId) {
    return this.update({
      del_flag: 1
    }, {
      role_id: roleId
    })
  }
}

module.exports = new RoleModel()
