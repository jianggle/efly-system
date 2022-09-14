const CmsLinkCategoryModel = require('@app/model/cms_link_category')
const CmsLinkModel = require('@app/model/cms_link')
const ParamCheck = require('@app/utils/paramCheck')
const Validator = require('@app/utils/validator')
const { responseSuccess, ServiceException } = require('@app/utils/resModel')

const handleEditCategory = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    taxis: new ParamCheck().isRequired().isNumber().min(0).max(9999),
    catname: new ParamCheck().isRequired().min(2).max(60),
    description: new ParamCheck().isRequired().max(140),
  })

  const {
    catid,
    taxis,
    catname,
    description
  } = ctx.request.body

  const isUpdate = Validator.isModify(ctx, 'catid')

  const existItem = await CmsLinkCategoryModel.findOne({ where: { catname } })

  const params = {
    taxis,
    catname,
    description
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

exports.addCmsLinkCategoryAction = (ctx) => {
  return handleEditCategory(ctx)
}

exports.modifyCmsLinkCategoryAction = (ctx) => {
  return handleEditCategory(ctx)
}

exports.removeCmsLinkCategoryAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    catid: new ParamCheck().isRequired().isNumber().isPositiveInteger()
  })
  const { catid } = ctx.request.body
  await CmsLinkCategoryModel.destroy({ catid })
  await CmsLinkModel.destroy({ catid })
  await responseSuccess(ctx)
}

exports.listCmsLinkCategoryAction = async (ctx) => {
  const result = await CmsLinkCategoryModel.getList()
  await responseSuccess(ctx, result)
}

exports.orderCmsLinkCategoryAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    catid: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    taxis: new ParamCheck().isRequired().isNumber().min(0).max(9999)
  })
  const { catid, taxis } = ctx.request.body
  await CmsLinkCategoryModel.update({ taxis }, { catid })
  await responseSuccess(ctx)
}
