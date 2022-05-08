const BlogLinkCategoryModel = require('@app/model/blog_link_category')
const BlogLinkModel = require('@app/model/blog_link')
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

  const existItem = await BlogLinkCategoryModel.findOne({ where: { catname } })

  const params = {
    taxis,
    catname,
    description
  }

  if (isUpdate) {
    if (existItem && existItem.catid !== catid) {
      throw new ServiceException('名称已存在')
    }
    await BlogLinkCategoryModel.update(params, { catid })
  } else {
    if (existItem) {
      throw new ServiceException('名称已存在')
    }
    await BlogLinkCategoryModel.create(params)
  }

  await responseSuccess(ctx)
}

exports.addBlogLinkCategoryAction = (ctx) => {
  return handleEditCategory(ctx)
}

exports.modifyBlogLinkCategoryAction = (ctx) => {
  return handleEditCategory(ctx)
}

exports.removeBlogLinkCategoryAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    catid: new ParamCheck().isRequired().isNumber().isPositiveInteger()
  })
  const { catid } = ctx.request.body
  await BlogLinkCategoryModel.destroy({ catid })
  await BlogLinkModel.destroy({ catid })
  await responseSuccess(ctx)
}

exports.listBlogLinkCategoryAction = async (ctx) => {
  const result = await BlogLinkCategoryModel.getList()
  await responseSuccess(ctx, result)
}

exports.orderBlogLinkCategoryAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    catid: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    taxis: new ParamCheck().isRequired().isNumber().min(0).max(9999)
  })
  const { catid, taxis } = ctx.request.body
  await BlogLinkCategoryModel.update({ taxis }, { catid })
  await responseSuccess(ctx)
}
