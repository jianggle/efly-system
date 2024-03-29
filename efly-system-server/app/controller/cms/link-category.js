import CmsLinkCategoryModel from '#model/cms_link_category.js'
import CmsLinkModel from '#model/cms_link.js'
import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess, ServiceException } from '#utils/resModel.js'

const handleEditCategory = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    taxis: new ParamCheck().isRequired().isNumber().min(0).max(9999),
    catname: new ParamCheck().isRequired().min(2).max(60),
    description: new ParamCheck().isRequired().max(140),
  })

  const { catid, taxis, catname, description } = ctx.request.body

  const isUpdate = Validator.isModify(ctx, 'catid')

  const existItem = await CmsLinkCategoryModel.findOne({ where: { catname } })

  const params = {
    taxis,
    catname,
    description,
  }

  if (isUpdate) {
    if (existItem && existItem.catid !== catid) {
      throw new ServiceException('名称已存在')
    }
    await CmsLinkCategoryModel.update(params, { catid })
  } else {
    if (existItem) {
      throw new ServiceException('名称已存在')
    }
    await CmsLinkCategoryModel.create(params)
  }

  await responseSuccess(ctx)
}

export const addCmsLinkCategoryAction = (ctx) => {
  return handleEditCategory(ctx)
}

export const modifyCmsLinkCategoryAction = (ctx) => {
  return handleEditCategory(ctx)
}

export const removeCmsLinkCategoryAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    catid: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
  })
  const { catid } = ctx.request.body
  await CmsLinkCategoryModel.destroy({ catid })
  await CmsLinkModel.destroy({ catid })
  await responseSuccess(ctx)
}

export const listCmsLinkCategoryAction = async (ctx) => {
  const result = await CmsLinkCategoryModel.getList()
  await responseSuccess(ctx, result)
}

export const orderCmsLinkCategoryAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    catid: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    taxis: new ParamCheck().isRequired().isNumber().min(0).max(9999),
  })
  const { catid, taxis } = ctx.request.body
  await CmsLinkCategoryModel.update({ taxis }, { catid })
  await responseSuccess(ctx)
}
