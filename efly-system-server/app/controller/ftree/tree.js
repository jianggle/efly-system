import FtTreeModel from '#model/ft_tree.js'
import FtPersonModel from '#model/ft_person.js'
import FtRelationshipModel from '#model/ft_relationship.js'
import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess, ServiceException } from '#utils/resModel.js'
import dayjs from 'dayjs'
import { isSuperRole } from '#controller/system/user.js'
import { sortNodesByRank, setNodeLevel } from './treeAssistant.js'

const handleEditTree = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    treeName: new ParamCheck().isRequired().min(2).max(30),
    treeDesc: new ParamCheck().isRequired().max(140),
  })

  const { treeId, treeName, treeDesc } = ctx.request.body

  const isUpdate = Validator.isModify(ctx, 'treeId')

  const existItem = await FtTreeModel.findOne({
    where: { treeName, treeAuthor: ctx.state.user.id },
  })

  const params = {
    treeName,
    treeDesc,
  }

  if (isUpdate) {
    if (existItem && existItem.treeId !== treeId) {
      throw new ServiceException('已存在同名家谱')
    }
    const is_super_role = await isSuperRole(ctx.state.user.id)
    if (!is_super_role) {
      await FtTreeModel.checkAuthor(treeId, ctx.state.user.id)
    }
    await FtTreeModel.update(params, { treeId })
  } else {
    if (existItem) {
      throw new ServiceException('已存在同名家谱')
    }
    await FtTreeModel.create({ ...params, treeAuthor: ctx.state.user.id })
  }

  await responseSuccess(ctx)
}

export const addFtTreeAction = (ctx) => {
  return handleEditTree(ctx)
}

export const modifyFtTreeAction = (ctx) => {
  return handleEditTree(ctx)
}

export const removeFtTreeAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    treeId: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
  })
  const { treeId } = ctx.request.body
  const is_super_role = await isSuperRole(ctx.state.user.id)
  if (!is_super_role) {
    await FtTreeModel.checkAuthor(treeId, ctx.state.user.id)
  }
  await FtTreeModel.destroy({ treeId })
  await FtPersonModel.destroy({ treeId })
  await FtRelationshipModel.destroy({ treeId })
  await responseSuccess(ctx)
}

export const listFtTreeAction = async (ctx) => {
  const is_super_role = await isSuperRole(ctx.state.user.id)
  const result = await FtTreeModel.getList(is_super_role ? undefined : ctx.state.user.id)
  await responseSuccess(
    ctx,
    result.map((item) => ({
      ...item,
      createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
      updateTime: dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss'),
    }))
  )
}

export const getFtTreeByIdAction = async (ctx) => {
  await ParamCheck.check(ctx.request.query, {
    id: new ParamCheck().isRequired().isString().isPositiveInteger(),
  })

  const treeId = ctx.request.query.id * 1

  await FtTreeModel.checkAuthor(treeId, ctx.state.user.id)

  const temp_nodes = await FtPersonModel.findAll({ where: { treeId } })
  const temp_links = await FtRelationshipModel.findAll({ where: { treeId } })

  const nodes = temp_nodes.map((item) => {
    return {
      id: item.id,
      name: item.name,
      sex: item.sex,
      level: 0,
      leafDescendantCount: 0,
      directDescendantCount: 0,
      rank: item.rank,
    }
  })
  const links = temp_links.map((item) => {
    return {
      id: item.id,
      source: item.fromPersonId,
      target: item.toPersonId,
      type: item.type,
      higher: item.higher,
    }
  })

  // 按rank排序节点
  sortNodesByRank(nodes)

  // 计算行距
  const rowDistanceMap = new Map()
  setNodeLevel(nodes, links, rowDistanceMap)

  await responseSuccess(ctx, {
    nodes,
    links,
    nextRowDistance: Object.fromEntries(rowDistanceMap.entries()),
  })
}
