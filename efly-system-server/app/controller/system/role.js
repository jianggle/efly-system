const RoleModel = require('@app/model/sys_role')
const ParamCheck = require('@app/utils/paramCheck')
const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')

const checkSystemRole = async (roleId) => {
  const result = await RoleModel.findOne({
    where: {
      roleId,
      delFlag: 0
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
  await ParamCheck.check(ctx.request.body, {
    roleName: new ParamCheck().isRequired().min(2).max(30),
    roleMenu: new ParamCheck().isRequired().pattern(/^(|[1-9]\d*(,[1-9]\d*)*)$/),
    status: new ParamCheck().isRequired().isNumber().pattern(/^(0|1)$/),
    remark: new ParamCheck().isRequired().max(140)
  })

  const isUpdate = Validator.isModify(ctx, 'roleId')
  const {
    roleId,
    roleName,
    roleMenu,
    status,
    remark,
  } = ctx.request.body

  const existItem = await RoleModel.findOne({ where: { roleName, delFlag: 0 } })
  const repeatMsg = '已有同名角色存在'

  const params = {
    roleName,
    status,
    remark,
  }
  if (isUpdate) {
    await checkSystemRole(roleId)
    if (existItem && existItem.roleId !== roleId) {
      throw new CustomException(repeatMsg)
    }
    await RoleModel.update(params, { roleId })
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
  await ParamCheck.check(ctx.request.body, {
    roleId: new ParamCheck().isRequired().isPositiveInteger()
  })
  const { roleId } = ctx.request.body
  await checkSystemRole(roleId)
  await RoleModel.update({ delFlag: 1 }, { roleId })
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
