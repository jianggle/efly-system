import CmsCategoryModel from '#model/cms_category.js'
import CmsArticleModel from '#model/cms_article.js'
import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess, ServiceException } from '#utils/resModel.js'
import { listToTree } from '#utils/index.js'

const handleEditCategory = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    pid: new ParamCheck().isRequired().isNumber().min(0),
    taxis: new ParamCheck().isRequired().isNumber().min(0).max(9999),
    sortname: new ParamCheck().isRequired().min(2).max(60),
    alias: new ParamCheck().isRequired().max(200),
    description: new ParamCheck().isRequired().max(140),
  })

  let { sid, pid, taxis, sortname, alias, description } = ctx.request.body

  const isUpdate = Validator.isModify(ctx, 'sid')
  alias = Validator.formatAlias(alias)

  const existItem = await CmsCategoryModel.findOne({ where: { sortname } })
  let existAlias = null
  if (alias) {
    existAlias = await CmsCategoryModel.findOne({ where: { alias } })
  }

  const params = {
    pid,
    taxis,
    sortname,
    alias,
    description,
  }

  if (isUpdate) {
    if (existItem && existItem.sid !== sid) {
      throw new ServiceException('名称已存在')
    }
    if (existAlias && existAlias.sid !== sid) {
      throw new ServiceException('别名已存在')
    }
    await CmsCategoryModel.update(params, { sid })
  } else {
    if (existItem) {
      throw new ServiceException('名称已存在')
    }
    if (existAlias) {
      throw new ServiceException('别名已存在')
    }
    await CmsCategoryModel.create(params)
  }

  await responseSuccess(ctx)
}

export const addCmsCategoryAction = (ctx) => {
  return handleEditCategory(ctx)
}

export const modifyCmsCategoryAction = (ctx) => {
  return handleEditCategory(ctx)
}

export const removeCmsCategoryAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    sid: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
  })
  const { sid } = ctx.request.body
  await CmsCategoryModel.destroy({ sid })
  await CmsArticleModel.update({ sortid: -1 }, { sortid: sid })
  await responseSuccess(ctx)
}

export const listCmsCategoryAction = async (ctx) => {
  const result = await CmsCategoryModel.getList()
  await responseSuccess(ctx, listToTree(result, 'sid', 'pid'))
}

export const orderCmsCategoryAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    sid: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    taxis: new ParamCheck().isRequired().isNumber().min(0).max(9999),
  })
  const { sid, taxis } = ctx.request.body
  await CmsCategoryModel.update({ taxis }, { sid })
  await responseSuccess(ctx)
}
