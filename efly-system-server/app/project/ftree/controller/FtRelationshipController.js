import FtTreeModel from '../model/FtTreeModel.js'
import FtPersonModel from '../model/FtPersonModel.js'
import FtRelationshipModel from '../model/FtRelationshipModel.js'

import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess, ServiceException } from '#utils/resModel.js'

const isHigher = (code) => {
  return { 1: 1, 2: 1, 5: -1, 6: -1 }[code] || 0
}

const getReverse = (relationId, toSex) => {
  switch (relationId) {
    case 1:
      return toSex === 1 ? 5 : 6
    case 2:
      return toSex === 1 ? 5 : 6
    case 3:
      return 4
    case 4:
      return 3
    case 5:
      return toSex === 1 ? 1 : 2
    case 6:
      return toSex === 1 ? 1 : 2
    case 7:
      return 3
    default:
      return null
  }
}

const relationMap = { 1: '父', 2: '母', 3: '夫', 4: '妻', 5: '子', 6: '女', 7: '妾' }
const getRelationText = (code) => {
  return relationMap[code] || ''
}

export const getRelationBySingleSexAction = async (ctx) => {
  await ParamCheck.check(ctx.request.query, {
    sex: new ParamCheck().isRequired().pattern(/^(0|1)$/),
  })
  const sex = ctx.request.query.sex * 1
  const result = [
    { name: '父', id: 1 },
    { name: '母', id: 2 },
    { name: '子', id: 5 },
    { name: '女', id: 6 },
  ]
  if (sex === 1) {
    result.push({ name: '妻', id: 4 })
  } else if (sex === 0) {
    result.push({ name: '夫', id: 3 })
  }
  await responseSuccess(ctx, result)
}

export const getRelationBySexAction = async (ctx) => {
  await ParamCheck.check(ctx.request.query, {
    fromsex: new ParamCheck().isRequired().pattern(/^(0|1)$/),
    tosex: new ParamCheck().isRequired().pattern(/^(0|1)$/),
  })
  const fromsex = ctx.request.query.fromsex * 1
  const tosex = ctx.request.query.tosex * 1
  let result = []
  if (fromsex === 1 && tosex === 1) {
    result = [
      { name: '父', id: 1 },
      { name: '子', id: 5 },
    ]
  } else if (fromsex === 0 && tosex === 1) {
    result = [
      { name: '母', id: 2 },
      { name: '妻', id: 4 },
      { name: '女', id: 6 },
    ]
  } else if (fromsex === 1 && tosex === 0) {
    result = [
      { name: '父', id: 1 },
      { name: '夫', id: 3 },
      { name: '子', id: 5 },
    ]
  } else if (fromsex === 0 && tosex === 0) {
    result = [
      { name: '母', id: 2 },
      { name: '女', id: 6 },
    ]
  }
  await responseSuccess(ctx, result)
}

export const buildFtRelationAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    treeId: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    relationType: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    fromPersonId: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    toPersonId: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
  })

  const { treeId, relationType, fromPersonId, toPersonId } = ctx.request.body

  if (fromPersonId === toPersonId) throw new ServiceException('不能建立自己跟自己的关系')

  await FtTreeModel.checkAuthor(treeId, ctx.state.user.id)

  const fromPerson = await FtPersonModel.findOne({ where: { id: fromPersonId } })
  if (!fromPerson) throw new ServiceException('fromPerson 不存在')

  const toPerson = await FtPersonModel.findOne({ where: { id: toPersonId } })
  if (!toPerson) throw new ServiceException('toPerson 不存在')

  const relationship = await FtRelationshipModel.findOne({ where: { fromPersonId, toPersonId } })
  const reverseRelationship = await FtRelationshipModel.findOne({
    where: { fromPersonId: toPersonId, toPersonId: fromPersonId },
  })

  if (!relationship) {
    await FtRelationshipModel.create({
      treeId,
      fromPersonId,
      toPersonId,
      type: getRelationText(relationType),
      higher: isHigher(relationType),
    })
  } else {
    await FtRelationshipModel.update(
      { type: getRelationText(relationType), higher: isHigher(relationType) },
      { id: relationship.id }
    )
  }

  if (!reverseRelationship) {
    await FtRelationshipModel.create({
      treeId,
      fromPersonId: toPersonId,
      toPersonId: fromPersonId,
      type: getRelationText(getReverse(relationType, toPerson.sex)),
      higher: 0 - isHigher(relationType),
    })
  } else {
    await FtRelationshipModel.update(
      {
        type: getRelationText(getReverse(relationType, toPerson.sex)),
        higher: 0 - isHigher(relationType),
      },
      { id: reverseRelationship.id }
    )
  }

  await responseSuccess(ctx)
}

export const addFtRelationAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    treeId: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    relationType: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    fromPersonId: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    toPersonName: new ParamCheck().isRequired().min(2).max(30),
  })

  const { treeId, relationType, fromPersonId, toPersonName } = ctx.request.body

  await FtTreeModel.checkAuthor(treeId, ctx.state.user.id)

  const fromPerson = await FtPersonModel.findOne({ where: { id: fromPersonId } })
  if (!fromPerson) throw new ServiceException('fromPerson 不存在')

  const { insertId: toPersonId } = await FtPersonModel.create({
    treeId,
    name: toPersonName,
    sex: [1, 3, 5].includes(relationType) ? 1 : 0,
    rank: 999,
  })

  await FtRelationshipModel.create({
    treeId,
    fromPersonId: toPersonId,
    toPersonId: fromPersonId,
    type: getRelationText(relationType),
    higher: isHigher(relationType),
  })

  await FtRelationshipModel.create({
    treeId,
    fromPersonId,
    toPersonId,
    type: getRelationText(getReverse(relationType, fromPerson.sex)),
    higher: 0 - isHigher(relationType),
  })

  await responseSuccess(ctx)
}
