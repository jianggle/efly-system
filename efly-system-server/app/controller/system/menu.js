import MenuModel from '#model/sys_menu.js'
import RoleModel from '#model/sys_role.js'
import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess, ServiceException } from '#utils/resModel.js'
import { listToTree, treeFind } from '#utils/index.js'

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
    throw new ServiceException('名称不得与已有项重复')
  }

  if (menuType === 'A') {
    permit = (permit || '').trim()
    if (!permit || typeof permit !== 'string') {
      throw new ServiceException('permit不合法')
    }
    const existPermit = await MenuModel.findOne({ where: { permit } })
    if (existPermit && (!isUpdate || existPermit.menuId !== menuId)) {
      throw new ServiceException('权限标识不得与已有项重复')
    }
  } else {
    path = (path || '').trim()
    if (!path || typeof path !== 'string') {
      throw new ServiceException('path不合法')
    }
    const existPath = await MenuModel.findOne({ where: { path } })
    if (existPath && (!isUpdate || existPath.menuId !== menuId)) {
      throw new ServiceException('路由地址不得与已有项重复')
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

  await responseSuccess(ctx)
}

export const addMenuAction = (ctx) => {
  return handleEditMenu(ctx)
}

export const modifyMenuAction = (ctx) => {
  return handleEditMenu(ctx)
}

const getMenuList = async (simple = false) => {
  const result = await MenuModel.findAll({
    order: MenuModel.defaultOrder,
    attributes: simple === true ? ['menu_id', 'parent_id', 'menu_name'] : [],
  })
  const arr = JSON.parse(JSON.stringify(result))
  return listToTree(arr, 'menuId', 'parentId')
}

export const deleteMenuAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    menuId: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
  })
  const { menuId } = ctx.request.body
  // 获取所有菜单组成的树形结构
  const allTree = await getMenuList(true)
  // 筛选出要删除的那个枝桠
  const needTree = treeFind(allTree, (item) => item['menuId'] === menuId)
  // 获取枝桠上的所有id
  const getIds = (obj) => {
    const ids = [obj['menuId']]
    const saveIds = (arr) => {
      if (Array.isArray(arr) && arr.length) {
        arr.forEach((item) => {
          ids.push(item['menuId'])
          saveIds(item.children)
        })
      }
    }
    saveIds(obj.children)
    return ids
  }
  const ids = getIds(needTree)
  // 执行删除
  await MenuModel.destroy({ menuId: ids })
  await RoleModel.deleteRoleMenu(ids)
  await responseSuccess(ctx)
}

export const listMenuAction = async (ctx) => {
  const res = await getMenuList()
  await responseSuccess(ctx, res)
}

export const listSimpleMenuAction = async (ctx) => {
  const res = await getMenuList(true)
  await responseSuccess(ctx, res)
}

export const modifyMenuOrderAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    menuId: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    orderNum: new ParamCheck().isRequired().isNumber().min(0).max(9999),
  })
  const { menuId, orderNum } = ctx.request.body
  await MenuModel.update({ orderNum }, { menuId })
  await responseSuccess(ctx)
}
