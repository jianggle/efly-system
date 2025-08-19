import BaseModel from '#utils/db_orm.js'
import { dbTables } from '#config/index.js'

class SysRoleModel extends BaseModel {
  constructor() {
    super(dbTables.SYS_ROLE)
  }

  getSuperRoleId() {
    return 1
  }

  getRoles(simple = false) {
    return this.findAll({
      where: {
        del_flag: 0,
      },
      order: 'create_time DESC',
      attributes: simple === true ? ['role_id', 'role_name'] : [],
    })
  }

  getRolesByUserId(userId, justValid = false) {
    let condition = `a.user_id=${userId} AND a.role_id=b.role_id AND b.del_flag=0`
    if (justValid === true) {
      condition += ' AND status=0'
    }
    return this.query(
      `SELECT a.role_id,b.role_name FROM ${dbTables.SYS_USER_ROLE} AS a,${this.table} AS b WHERE ${condition}`
    )
  }

  async updateUserRole(userId, ids) {
    const newIds = ids ? ids.split(',').map((item) => item * 1) : []
    const oldRoles = await this.query(
      `SELECT role_id FROM ${dbTables.SYS_USER_ROLE} WHERE user_id=${userId}`
    )
    const oldIds = oldRoles.map((item) => item.roleId)
    const addIds = newIds.filter((item) => !oldIds.includes(item))
    const delIds = oldIds.filter((item) => !newIds.includes(item))
    if (addIds.length) {
      const addValues = addIds.map((item) => `('${userId}', '${item}')`)
      await this.query(
        `INSERT INTO ${dbTables.SYS_USER_ROLE} (user_id, role_id) VALUES ${addValues.join(',')}`
      )
    }
    for (let role_id of delIds) {
      await this.query(
        `DELETE FROM ${dbTables.SYS_USER_ROLE} WHERE user_id=${userId} AND role_id=${role_id}`
      )
    }
  }

  async getRoleMenu(roleId) {
    const arr = await this.query(
      `SELECT menu_id FROM ${dbTables.SYS_ROLE_MENU} WHERE role_id=${roleId}`
    )
    return arr.map((item) => item.menuId)
  }

  async updateRoleMenu(roleId, ids) {
    const newIds = ids ? ids.split(',').map((item) => item * 1) : []
    const oldIds = await this.getRoleMenu(roleId)
    const addIds = newIds.filter((item) => !oldIds.includes(item))
    const delIds = oldIds.filter((item) => !newIds.includes(item))
    if (addIds.length) {
      const addValues = addIds.map((item) => `('${roleId}', '${item}')`)
      await this.query(
        `INSERT INTO ${dbTables.SYS_ROLE_MENU} (role_id, menu_id) VALUES ${addValues.join(',')}`
      )
    }
    for (let menu_id of delIds) {
      await this.query(
        `DELETE FROM ${dbTables.SYS_ROLE_MENU} WHERE role_id=${roleId} AND menu_id=${menu_id}`
      )
    }
  }

  deleteRoleMenu(menuIds = []) {
    return this.query(
      `DELETE FROM ${dbTables.SYS_ROLE_MENU} WHERE menu_id in (${menuIds.toString()})`
    )
  }
}

export default new SysRoleModel()
