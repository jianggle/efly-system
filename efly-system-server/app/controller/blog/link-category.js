const BlogLinkCategoryModel = require('@app/model/blog_link_category')
const BlogLinkModel = require('@app/model/blog_link')

const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')

const handleEditCategory = async (ctx) => {
  let {
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
      throw new CustomException('名称已存在')
    }

    await BlogLinkCategoryModel.update(params, { catid })
  } else {
    if (existItem) {
      throw new CustomException('名称已存在')
    }

    await BlogLinkCategoryModel.create(params)
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.addBlogLinkCategoryAction = (ctx) => {
  return handleEditCategory(ctx)
}

exports.modifyBlogLinkCategoryAction = (ctx) => {
  return handleEditCategory(ctx)
}

exports.removeBlogLinkCategoryAction = async (ctx) => {
  const { catid } = ctx.request.body
  if (!Validator.isPositiveInteger(catid)) {
    throw new CustomException('catid不合法')
  }

  await BlogLinkCategoryModel.destroy({ catid })
  await BlogLinkModel.destroy({ catid })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.listBlogLinkCategoryAction = async (ctx) => {
  const result = await BlogLinkCategoryModel.getList()

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

exports.orderBlogLinkCategoryAction = async (ctx) => {
  const { catid, taxis } = ctx.request.body
  if (!Validator.isPositiveInteger(catid)) {
    throw new CustomException('catid不合法')
  }

  await BlogLinkCategoryModel.update({ taxis }, { catid })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
