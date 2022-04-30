const MenuModel = require('@app/model/sys_menu')
const ParamCheck = require('@app/utils/paramCheck')
const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')
const { listToTree } = require('@app/utils')

const handleEditMenu = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    parentId: new ParamCheck().isRequired().isNumber().min(0),
    menuType: new ParamCheck().isRequired().pattern(/^(M|C|A|L)$/),
    menuName: new ParamCheck().isRequired().min(2).max(50),
  })

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

  const existName = await MenuModel.findOne({ where: { menuName } })
  if (existName && (!isUpdate || existName.menuId !== menuId)) {
    throw new CustomException('名称不得与已有项重复')
  }

  if (menuType === 'A') {
    permit = (permit || '').trim()
    if (!permit || typeof permit !== 'string') {
      throw new CustomException('permit不合法')
    }
    const existPermit = await MenuModel.findOne({ where: { permit } })
    if (existPermit && (!isUpdate || existPermit.menuId !== menuId)) {
      throw new CustomException('权限标识不得与已有项重复')
    }
  } else {
    path = (path || '').trim()
    if (!path || typeof path !== 'string') {
      throw new CustomException('path不合法')
    }
    const existPath = await MenuModel.findOne({ where: { path } })
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
    await MenuModel.update(params, { menuId })
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
  await ParamCheck.check(ctx.request.body, {
    menuId: new ParamCheck().isRequired().isNumber().isPositiveInteger()
  })
  const { menuId } = ctx.request.body
  await MenuModel.destroy({ menuId })
  await MenuModel.destroy({ parentId: menuId })
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

const getMenuList = async (ctx, simple = false) => {
  const result = await MenuModel.findAll({
    order: MenuModel.defaultOrder,
    attributes: simple === true ? ['menu_id', 'parent_id', 'menu_name'] : []
  })
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
  await ParamCheck.check(ctx.request.body, {
    menuId: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    orderNum: new ParamCheck().isRequired().isNumber().min(0).max(9999)
  })
  const { menuId, orderNum } = ctx.request.body
  await MenuModel.update({ orderNum }, { menuId })
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
