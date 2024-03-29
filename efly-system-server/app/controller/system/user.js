import UserModel from '#model/sys_user.js'
import RoleModel from '#model/sys_role.js'
import MenuModel from '#model/sys_menu.js'

import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess, ServiceException } from '#utils/resModel.js'
import { getUserIp, listToTree } from '#utils/index.js'
import { saveLoginLog } from '#utils/log.js'
import { authLogin, authLogout } from '#utils/auth.js'
import { uploadToQiniu, deleteQiniuItem } from '#utils/qiniu.js'

import fs from 'fs'
import dayjs from 'dayjs'
import md5 from 'blueimp-md5'

const randomSalt = function () {
  return md5(Date.now() + Math.random())
}
const encodePassword = function (pwd, salt) {
  return md5(pwd.slice(0, 5) + salt + pwd.slice(5))
}

const checkSuperRole = (ids = []) => {
  const superRoleId = RoleModel.getSuperRoleId()
  return ids.includes(superRoleId + '') || ids.includes(superRoleId)
}

const checkSystemUser = async (userId) => {
  const result = await UserModel.getOne(userId)
  if (!result) {
    throw new ServiceException('用户不存在')
  }
  const systemUserFlag = 0
  if (result.isSystem === systemUserFlag) {
    throw new ServiceException('非法操作')
  }
}

export const loginAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    username: new ParamCheck().isRequired().pattern(/^[0-9A-Za-z]{5,11}$/),
    password: new ParamCheck().isRequired(),
    code: new ParamCheck().isRequired().pattern(/^[0-9A-Za-z]{4}$/),
  })

  const { username, password, code } = ctx.request.body

  const cptVal = ctx.session.captcha
  if (!cptVal) {
    throw new ServiceException('验证码已过期')
  }
  if (code.toLowerCase() !== cptVal) {
    throw new ServiceException('验证码错误')
  }

  const result = await UserModel.findOne({
    where: {
      userName: username,
      delFlag: 0,
    },
  })
  if (!result) {
    throw new ServiceException('账号不存在')
  }
  if (result.password !== encodePassword(password, result.salt)) {
    throw new ServiceException('密码错误')
  }
  if (result.status !== 0) {
    throw new ServiceException('账号未启用')
  }

  await UserModel.update(
    {
      loginIp: getUserIp(ctx.request),
      loginDate: new Date(),
    },
    {
      userId: result.userId,
    }
  )
  const token = authLogin({
    id: result.userId,
  })
  await saveLoginLog(ctx, token)
  await responseSuccess(ctx, token)
}

export const logoutAction = async (ctx) => {
  await authLogout(ctx)
  await responseSuccess(ctx)
}

const handleEditUser = async (ctx) => {
  const isUpdate = Validator.isModify(ctx, 'userId')
  const schema = {
    userName: new ParamCheck().isRequired().pattern(/^[0-9A-Za-z]{5,11}$/),
    realName: new ParamCheck().isRequired().min(2).max(30),
    phone: new ParamCheck().isRequired().isPhone(),
    role: new ParamCheck().isRequired().pattern(/^[1-9]\d*(,[1-9]\d*)*$/),
    status: new ParamCheck()
      .isRequired()
      .isNumber()
      .pattern(/^(0|1)$/),
  }
  if (!isUpdate) {
    schema.password = new ParamCheck().isRequired()
  }
  await ParamCheck.check(ctx.request.body, schema)

  const { userId, userName, password, realName, phone, role, status } = ctx.request.body

  if (checkSuperRole(role.split(','))) {
    throw new ServiceException('某个角色被禁止前台赋予用户')
  }
  const existItem = await UserModel.findOne({ where: { userName, delFlag: 0 } })
  const repeatMsg = '账号已存在'

  const params = {
    userName,
    realName,
    phone,
    status,
  }
  if (isUpdate) {
    await checkSystemUser(userId)
    if (existItem && existItem.userId !== userId) {
      throw new ServiceException(repeatMsg)
    }
    await UserModel.update(params, { userId })
    await RoleModel.updateUserRole(userId, role)
  } else {
    if (existItem) {
      throw new ServiceException(repeatMsg)
    }
    const salt = randomSalt()
    params.salt = salt
    params.password = encodePassword(password, salt)
    const { insertId } = await UserModel.create(params)
    await RoleModel.updateUserRole(insertId, role)
  }

  await responseSuccess(ctx)
}

export const addUserAction = (ctx) => {
  return handleEditUser(ctx)
}

export const modifyUserAction = (ctx) => {
  return handleEditUser(ctx)
}

export const deleteUserAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    userId: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
  })
  const { userId } = ctx.request.body
  await checkSystemUser(userId)
  await UserModel.update({ delFlag: 1 }, { userId })
  await responseSuccess(ctx)
}

export const listUserAction = async (ctx) => {
  await ParamCheck.check(ctx.request.query, {
    status: new ParamCheck().pattern(/^(|0|1)$/),
    keyword: new ParamCheck(),
  })
  const { status, keyword } = ctx.request.query
  const [offset, limit] = Validator.formatPagingParams(ctx)
  let result = await UserModel.getList(status, keyword, offset, limit)
  for (let item of result.rows) {
    item.role = await RoleModel.getRolesByUserId(item.userId)
  }
  await responseSuccess(ctx, result)
}

export const getUserPermit = async (userId) => {
  const userInfo = await UserModel.getOne(userId)
  if (!userInfo) {
    throw new ServiceException('用户不存在')
  }

  let roleMenus = []
  const userRole = await RoleModel.getRolesByUserId(userId, true)
  const roleArr = userRole.map((info) => info.roleId)
  // `超级管理员`直接拿到全部权限，否则拿该用户所有角色中`已生效`角色的权限
  if (checkSuperRole(roleArr)) {
    roleMenus = await MenuModel.findAll({ order: MenuModel.defaultOrder })
  } else {
    let roleMenuIds = []
    for (let roleId of roleArr) {
      let ids = await RoleModel.getRoleMenu(roleId)
      roleMenuIds = [...roleMenuIds, ...ids]
    }
    roleMenuIds = roleMenuIds.filter((item, index, arr) => arr.indexOf(item) === index)
    if (roleMenuIds.length) {
      roleMenus = await MenuModel.findAll({
        where: {
          menuId: roleMenuIds,
        },
        order: MenuModel.defaultOrder,
      })
    }
  }

  let invalidIds = [],
    permissions = [],
    menuList = [],
    apiGroup = []
  // 先拿到所有`未生效`的id
  for (let item of roleMenus) {
    if (item.isActivated !== 0) {
      invalidIds.push(item.menuId)
    }
  }
  // 格式化菜单、小权限、有权接口
  for (let item of roleMenus) {
    // 跳过`未生效`的
    if (item.isActivated !== 0) continue
    // 跳过`父级菜单未生效`的
    if (invalidIds.includes(item.parentId)) continue
    if (['C', 'A'].includes(item.menuType) && item.api) {
      apiGroup = [...apiGroup, ...item.api.split(',')]
    }
    if (item.menuType === 'A') {
      permissions.push(item.permit)
    } else {
      menuList.push({
        path: item.path,
        component: item.component,
        name: item.path.replace(/\/(\w)/g, ($0, $1) => $1.toUpperCase()),
        meta: {
          title: item.menuName,
          icon: item.icon,
          isCached: item.isCached === 0,
          isMenu: item.isMenu === 0,
        },
        menuId: item.menuId,
        parentId: item.parentId,
      })
    }
  }

  // 将`菜单`转换为树状结构
  const menuTree = listToTree(menuList, 'menuId', 'parentId')
  // 清除多余字段
  const cleanTree = (arr) => {
    arr.forEach((item) => {
      delete item.menuId
      delete item.parentId
      cleanTree(item.children || [])
    })
    return arr
  }
  const menus = cleanTree(menuTree)
  // 可用接口去重
  const validApis = apiGroup.filter((item, index, arr) => arr.indexOf(item) === index)

  return {
    userInfo,
    userRole,
    permissions,
    menus,
    validApis,
  }
}

export const permitAction = async (ctx) => {
  const { userInfo, userRole, permissions, menus } = await getUserPermit(ctx.state.user.id)
  await responseSuccess(ctx, {
    user: {
      ...userInfo,
      role: userRole,
    },
    permissions,
    menus,
  })
}

export const infoUserAction = async (ctx) => {
  const result = await UserModel.getOne(ctx.state.user.id)
  if (!result) {
    throw new ServiceException('用户不存在')
  }
  result.role = await RoleModel.getRolesByUserId(ctx.state.user.id)
  await responseSuccess(ctx, result)
}

export const modifyUserAvatarAction = async (ctx) => {
  // 获取临时路径
  const localPath = ctx.file.path
  // 上传到七牛
  const reader = fs.createReadStream(localPath)
  const fileName = 'avatar_' + dayjs().format('YYYYMM') + '_' + ctx.file.filename
  const result = await uploadToQiniu(reader, fileName)
  // 删除临时文件
  fs.unlinkSync(localPath)
  // 更新数据库信息
  await UserModel.update({ avatar: result.fileUrl }, { userId: ctx.state.user.id })
  // 删除掉旧的头像
  const { oldAvatar } = ctx.request.body
  if (!!oldAvatar && /avatar_\d{6}_\d{13}$/.test(oldAvatar)) {
    await deleteQiniuItem(oldAvatar)
  }
  await responseSuccess(ctx, result.fileUrl)
}

export const modifyUserInfoAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    realName: new ParamCheck().isRequired().min(2).max(10),
    phone: new ParamCheck().isRequired().isPhone(),
  })
  const { realName, phone } = ctx.request.body
  await UserModel.update({ realName, phone }, { userId: ctx.state.user.id })
  await responseSuccess(ctx)
}

export const modifyUserPwdAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    oldPwd: new ParamCheck().isRequired(),
    newPwd: new ParamCheck().isRequired(),
  })
  const { oldPwd, newPwd } = ctx.request.body
  const userId = ctx.state.user.id
  const info = await UserModel.getOne(userId)
  if (info.password !== encodePassword(oldPwd, info.salt)) {
    throw new ServiceException('旧密码错误')
  }
  await UserModel.update({ password: encodePassword(newPwd, info.salt) }, { userId })
  await authLogout(ctx)
  await responseSuccess(ctx)
}

export const modifyUserSettingAction = async (ctx) => {
  const setting = Object.keys(ctx.request.body).length ? JSON.stringify(ctx.request.body) : ''
  await UserModel.update({ setting }, { userId: ctx.state.user.id })
  await responseSuccess(ctx)
}
