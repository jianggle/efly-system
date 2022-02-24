const BlogLinkCategoryModel = require('@app/model/blog/link-category')
const BlogLinkModel = require('@app/model/blog/link')

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

  const existItem = await BlogLinkCategoryModel.getOneCategory({ catname })

  const params = {
    taxis,
    catname,
    description
  }

  if (isUpdate) {
    if (existItem && existItem.catid !== catid) {
      throw new CustomException('名称已存在')
    }

    await BlogLinkCategoryModel.updateCategory(catid, params)
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

  await BlogLinkCategoryModel.removeCategory(catid)
  await BlogLinkModel.removeLinkByCatid(catid)

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.listBlogLinkCategoryAction = async (ctx) => {
  const result = await BlogLinkCategoryModel.getCategories()

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

  await BlogLinkCategoryModel.updateCategory(catid, { taxis })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
