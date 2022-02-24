const MenuModel = require('@app/model/system/menu')
const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')
const { listToTree } = require('@app/utils')

const handleEditMenu = async (ctx) => {
  let {
    menuId,
    parentId,
    menuType,
    menuName,
    icon,
    path,
    component,
    permit,
    api,
    isMenu,
    isCached,
    isActivated,
    orderNum,
  } = ctx.request.body

  if (parentId !== 0 && !Validator.isPositiveInteger(parentId)) {
    throw new CustomException('parentId不合法')
  }

  if (!['M', 'C', 'A', 'L'].includes(menuType)) {
    throw new CustomException('menuType不合法')
  }

  const isUpdate = Validator.isModify(ctx, 'menuId')

  const existName = await MenuModel.getOneMenu({ menu_name: menuName })
  if (existName && (!isUpdate || existName.menuId !== menuId)) {
    throw new CustomException('名称不得与已有项重复')
  }

  if (menuType === 'A') {
    permit = (permit || '').trim()
    if (!permit || typeof permit !== 'string') {
      throw new CustomException('permit不合法')
    }
    const existPermit = await MenuModel.getOneMenu({ permit })
    if (existPermit && (!isUpdate || existPermit.menuId !== menuId)) {
      throw new CustomException('权限标识不得与已有项重复')
    }
  } else {
    path = (path || '').trim()
    if (!path || typeof path !== 'string') {
      throw new CustomException('path不合法')
    }
    const existPath = await MenuModel.getOneMenu({ path })
    if (existPath && (!isUpdate || existPath.menuId !== menuId)) {
      throw new CustomException('路由地址不得与已有项重复')
    }
  }

  if (menuType === 'M') {
    component = parentId === 0 ? 'Layout' : 'ParentView'
    permit = null
    api = null
    isCached = 1
  } else if (menuType === 'C') {
    permit = null
  } else if (menuType === 'A') {
    icon = path = component = isMenu = isCached = null
  } else if (menuType === 'L') {
    permit = component = api = isCached = null
  }

  const params = {
    parentId,
    menuType,
    menuName,
    icon,
    path,
    component,
    permit,
    api,
    isMenu,
    isCached,
    isActivated,
    orderNum,
  }

  if (isUpdate) {
    await MenuModel.updateMenu(menuId, params)
  } else {
    await MenuModel.create(params)
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.addMenuAction = (ctx) => {
  return handleEditMenu(ctx)
}

exports.modifyMenuAction = (ctx) => {
  return handleEditMenu(ctx)
}

exports.deleteMenuAction = async (ctx) => {
  const { menuId } = ctx.request.body
  if (!Validator.isPositiveInteger(menuId)) {
    throw new CustomException('menuId不合法')
  }
  await MenuModel.delMenu(menuId)
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

const getMenuList = async (ctx, simple = false) => {
  const result = await MenuModel.getMenus(simple)
  const arr = JSON.parse(JSON.stringify(result))
  const arr2 = listToTree(arr, 'menuId', 'parentId')
  ctx.body = {
    code: 0,
    msg: 'success',
    data: arr2
  }
}

exports.listMenuAction = (ctx) => {
  return getMenuList(ctx)
}

exports.listSimpleMenuAction = (ctx) => {
  return getMenuList(ctx, true)
}

exports.modifyMenuOrderAction = async (ctx) => {
  let {
    menuId,
    orderNum,
  } = ctx.request.body
  await MenuModel.updateMenu(menuId, { orderNum })
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
