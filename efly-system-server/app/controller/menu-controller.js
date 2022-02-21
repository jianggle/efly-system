const MenuModel = require('@app/model/menu-model')
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

  const isUpdate = Validator.isModify(ctx, 'menuId')

  let params = {
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

  const existItem = await MenuModel.getMenuByName(menuName)
  const repeatMsg = '名称不得与已有项重复'

  if (isUpdate) {
    if (existItem && existItem.menuId !== menuId) {
      throw new CustomException(repeatMsg)
    }
    await MenuModel.updateMenu(menuId, params)
  } else {
    if (existItem) {
      throw new CustomException(repeatMsg)
    }
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
