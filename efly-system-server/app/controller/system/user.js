const UserModel = require('@app/model/sys_user')
const RoleModel = require('@app/model/sys_role')
const MenuModel = require('@app/model/sys_menu')

const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')
const { getUserIp, listToTree } = require('@app/utils')
const { saveLoginLog } = require('@app/utils/log')

const { authLogin, authLogout } = require('@app/utils/auth')
const { uploadToQiniu, deleteQiniuItem } = require('@app/utils/qiniu')
const fs = require('fs')
const Moment = require('moment')

const md5 = require('blueimp-md5')
const encodePwd = function (pwd) {
  return md5(md5(pwd))
}

const checkSuperRole = (ids = []) => {
  const superRoleId = RoleModel.getSuperRoleId()
  return ids.includes(superRoleId + '') || ids.includes(superRoleId)
}

const checkSystemUser = async (userId) => {
  const result = await UserModel.getOne(userId)
  if (!result) {
    throw new CustomException('用户不存在')
  }
  const systemUserFlag = 0
  if (result.isSystem === systemUserFlag) {
    throw new CustomException('非法操作')
  }
}

exports.loginAction = async (ctx) => {
  let {
    username,
    password,
    code,
  } = ctx.request.body

  if (!username || !Validator.isValidAccount(username)) {
    throw '账号不合法'
  }
  if (!password) {
    throw '密码不合法'
  }
  if (!code || !Validator.isValidCaptcha(code)) {
    throw '验证码不合法'
  }

  const cptVal = ctx.session.captcha
  if (!cptVal) {
    throw '验证码已过期'
  }
  if (code.toLowerCase() !== cptVal) {
    throw '验证码错误'
  }

  const result = await UserModel.findOne({
    where: {
      userName: username,
      delFlag: 0
    }
  })
  if (!result) {
    throw '账号不存在'
  }
  if (result.password !== encodePwd(password)) {
    throw '密码错误'
  }
  if (result.status !== 0) {
    throw '账号未启用'
  }

  await UserModel.update({
    loginIp: getUserIp(ctx.request),
    loginDate: new Date()
  }, {
    userId: result.userId
  })
  const token = authLogin({
    id: result.userId
  })
  await saveLoginLog(ctx, token)

  ctx.body = {
    code: 0,
    msg: 'success',
    data: token
  }
}

exports.logoutAction = async (ctx) => {
  await authLogout(ctx)
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

const handleEditUser = async (ctx) => {
  let {
    userId,
    userName,
    password,
    realName,
    phone,
    role,
    status,
  } = ctx.request.body

  const isUpdate = Validator.isModify(ctx, 'userId')

  let params = {
    userName,
    realName,
    phone,
    status,
  }

  if (checkSuperRole(role.split(','))) {
    throw new CustomException('某个角色被禁止前台赋予用户')
  }

  const existItem = await UserModel.findOne({
    where: {
      userName,
      delFlag: 0
    }
  })
  const repeatMsg = '账号已存在'

  if (isUpdate) {
    await checkSystemUser(userId)
    if (existItem && existItem.userId !== userId) {
      throw new CustomException(repeatMsg)
    }
    await UserModel.update(params, { userId })
    await RoleModel.updateUserRole(userId, role)
  } else {
    if (existItem) {
      throw new CustomException(repeatMsg)
    }
    params.password = encodePwd(password)
    const { insertId } = await UserModel.create(params)
    await RoleModel.updateUserRole(insertId, role)
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.addUserAction = (ctx) => {
  return handleEditUser(ctx)
}

exports.modifyUserAction = (ctx) => {
  return handleEditUser(ctx)
}

exports.deleteUserAction = async (ctx) => {
  let { userId } = ctx.request.body
  if (!Validator.isPositiveInteger(userId)) {
    throw new CustomException('userId不合法')
  }

  await checkSystemUser(userId)
  await UserModel.update({ delFlag: 1 }, { userId })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.listUserAction = async (ctx) => {
  let {
    status,
    keyword,
  } = ctx.request.query
  const [offset, limit] = Validator.formatPagingParams(ctx)

  let result = await UserModel.getList(status, keyword, offset, limit)

  for (let item of result.rows) {
    item.role = await RoleModel.getRolesByUserId(item.userId)
  }

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

exports.getUserPermit = async (userId) => {
  const userInfo = await UserModel.getOne(userId)
  if (!userInfo) {
    throw new CustomException('用户不存在')
  }

  let roleMenus = []
  const userRole = await RoleModel.getRolesByUserId(userId, true)
  const roleArr = userRole.map(info => info.roleId)
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
          menuId: roleMenuIds
        },
        order: MenuModel.defaultOrder
      })
    }
  }

  let invalidIds = [], permissions = [], menuList = [], apiGroup = []
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
      apiGroup = [
        ...apiGroup,
        ...item.api.split(',')
      ]
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
        parentId: item.parentId
      })
    }
  }

  // 将`菜单`转换为树状结构
  const menuTree = listToTree(menuList, 'menuId', 'parentId')
  // 清除多余字段
  const cleanTree = (arr) => {
    arr.forEach(item => {
      delete item.menuId;
      delete item.parentId;
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
    validApis
  }
}

exports.permitAction = async (ctx) => {
  const {
    userInfo,
    userRole,
    permissions,
    menus
  } = await this.getUserPermit(ctx.state.user.id)
  ctx.body = {
    code: 0,
    msg: 'success',
    data: {
      user: {
        ...userInfo,
        role: userRole
      },
      permissions,
      menus
    }
  }
}

exports.infoUserAction = async (ctx) => {
  const result = await UserModel.getOne(ctx.state.user.id)
  if (!result) {
    throw new CustomException('用户不存在')
  }

  result.role = await RoleModel.getRolesByUserId(ctx.state.user.id)

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

exports.modifyUserAvatarAction = async (ctx) => {
  // 获取临时路径
  const localPath = ctx.file.path
  // 上传到七牛
  const reader = fs.createReadStream(localPath)
  const fileName = 'avatar_' + Moment().format('YYYYMM') + '_' + ctx.file.filename
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

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result.fileUrl
  }
}

exports.modifyUserInfoAction = async (ctx) => {
  let {
    realName,
    phone,
  } = ctx.request.body

  let params = {
    realName,
    phone,
  }

  await UserModel.update(params, { userId: ctx.state.user.id })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.modifyUserPwdAction = async (ctx) => {
  let { oldPwd, newPwd } = ctx.request.body
  const userId = ctx.state.user.id
  const info = await UserModel.getOne(userId)
  if (info.password !== encodePwd(oldPwd)) {
    throw new CustomException('旧密码错误')
  }

  await UserModel.update({ password: encodePwd(newPwd) }, { userId })
  await authLogout(ctx)

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.modifyUserSettingAction = async (ctx) => {
  const setting = Object.keys(ctx.request.body).length ? JSON.stringify(ctx.request.body) : ''
  await UserModel.update({ setting }, { userId: ctx.state.user.id })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
