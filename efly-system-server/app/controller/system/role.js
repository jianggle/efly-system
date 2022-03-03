const RoleModel = require('@app/model/sys_role')
const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')

const checkSystemRole = async (roleId) => {
  const result = await RoleModel.findOne({
    where: {
      roleId,
      del_flag: 0
    }
  })
  if (!result) {
    throw new CustomException('角色不存在')
  }
  const systemRoleFlag = 0
  if (result.isSystem === systemRoleFlag) {
    throw new CustomException('非法操作')
  }
}

const handleEditRole = async (ctx) => {
  let {
    roleId,
    roleName,
    roleMenu,
    status,
    remark,
  } = ctx.request.body

  const isUpdate = Validator.isModify(ctx, 'roleId')

  let params = {
    roleName,
    status,
    remark,
  }

  const existItem = await RoleModel.findOne({
    where: {
      roleName,
      del_flag: 0
    }
  })
  const repeatMsg = '已有同名角色存在'

  if (isUpdate) {
    await checkSystemRole(roleId)
    if (existItem && existItem.roleId !== roleId) {
      throw new CustomException(repeatMsg)
    }
    await RoleModel.update(params, { role_id: roleId })
    await RoleModel.updateRoleMenu(roleId, roleMenu)
  } else {
    if (existItem) {
      throw new CustomException(repeatMsg)
    }
    const { insertId } = await RoleModel.create(params)
    await RoleModel.updateRoleMenu(insertId, roleMenu)
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.addRoleAction = (ctx) => {
  return handleEditRole(ctx)
}

exports.modifyRoleAction = (ctx) => {
  return handleEditRole(ctx)
}

exports.deleteRoleAction = async (ctx) => {
  const { roleId } = ctx.request.body
  if (!Validator.isPositiveInteger(roleId)) {
    throw new CustomException('roleId不合法')
  }

  await checkSystemRole(roleId)
  await RoleModel.update({ del_flag: 1 }, { role_id: roleId })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.listRoleAction = async (ctx) => {
  const result = await RoleModel.getRoles()
  for (let item of result) {
    let ids = await RoleModel.getRoleMenu(item.roleId)
    item.roleMenu = ids.join(',')
  }
  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

exports.listSimpleRoleAction = async (ctx) => {
  const result = await RoleModel.getRoles(true)
  const superRoleId = RoleModel.getSuperRoleId()
  ctx.body = {
    code: 0,
    msg: 'success',
    data: result.filter(item => item.roleId !== superRoleId)
  }
}
