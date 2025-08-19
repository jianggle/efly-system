import SysRoleModel from '../model/SysRoleModel.js'

import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess, ServiceException } from '#utils/resModel.js'

const checkSystemRole = async (roleId) => {
  const result = await SysRoleModel.findOne({
    where: {
      roleId,
      delFlag: 0,
    },
  })
  if (!result) {
    throw new ServiceException('角色不存在')
  }
  const systemRoleFlag = 0
  if (result.isSystem === systemRoleFlag) {
    throw new ServiceException('非法操作')
  }
}

const handleEditRole = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    roleName: new ParamCheck().isRequired().min(2).max(30),
    roleMenu: new ParamCheck().isRequired().pattern(/^(|[1-9]\d*(,[1-9]\d*)*)$/),
    status: new ParamCheck()
      .isRequired()
      .isNumber()
      .pattern(/^(0|1)$/),
    remark: new ParamCheck().isRequired().max(140),
  })

  const isUpdate = Validator.isModify(ctx, 'roleId')
  const { roleId, roleName, roleMenu, status, remark } = ctx.request.body

  const existItem = await SysRoleModel.findOne({ where: { roleName, delFlag: 0 } })
  const repeatMsg = '已有同名角色存在'

  const params = {
    roleName,
    status,
    remark,
  }
  if (isUpdate) {
    await checkSystemRole(roleId)
    if (existItem && existItem.roleId !== roleId) {
      throw new ServiceException(repeatMsg)
    }
    await SysRoleModel.update(params, { roleId })
    await SysRoleModel.updateRoleMenu(roleId, roleMenu)
  } else {
    if (existItem) {
      throw new ServiceException(repeatMsg)
    }
    const { insertId } = await SysRoleModel.create(params)
    await SysRoleModel.updateRoleMenu(insertId, roleMenu)
  }

  await responseSuccess(ctx)
}

export const addRoleAction = (ctx) => {
  return handleEditRole(ctx)
}

export const modifyRoleAction = (ctx) => {
  return handleEditRole(ctx)
}

export const deleteRoleAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    roleId: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
  })
  const { roleId } = ctx.request.body
  await checkSystemRole(roleId)
  await SysRoleModel.update({ delFlag: 1 }, { roleId })
  await responseSuccess(ctx)
}

export const listRoleAction = async (ctx) => {
  const result = await SysRoleModel.getRoles()
  for (let item of result) {
    let ids = await SysRoleModel.getRoleMenu(item.roleId)
    item.roleMenu = ids.join(',')
  }
  await responseSuccess(ctx, result)
}

export const listSimpleRoleAction = async (ctx) => {
  const result = await SysRoleModel.getRoles(true)
  const superRoleId = SysRoleModel.getSuperRoleId()
  await responseSuccess(
    ctx,
    result.filter((item) => item.roleId !== superRoleId)
  )
}
