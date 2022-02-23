const BlogCategoryModel = require('@app/model/blog/category')
const BlogArticleModel = require('@app/model/blog/article')

const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')
const { listToTree } = require('@app/utils')

const handleEditCategory = async (ctx) => {
  let {
    sid,
    pid,
    taxis,
    sortname,
    alias,
    description
  } = ctx.request.body

  const isUpdate = Validator.isModify(ctx, 'sid')

  let params = {
    pid,
    taxis,
    sortname,
    alias,
    description
  }

  const existItem = await BlogCategoryModel.selectRepeat(sortname, alias)
  const repeatMsg = 'sortname或alias不能重复'

  if (isUpdate) {
    if (existItem && existItem.sid !== sid) {
      throw new CustomException(repeatMsg)
    }
    await BlogCategoryModel.updateCategory(sid, params)
  } else {
    if (existItem) {
      throw new CustomException(repeatMsg)
    }
    await BlogCategoryModel.create(params)
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.addBlogCategoryAction = (ctx) => {
  return handleEditCategory(ctx)
}

exports.modifyBlogCategoryAction = (ctx) => {
  return handleEditCategory(ctx)
}

exports.removeBlogCategoryAction = async (ctx) => {
  const { sid } = ctx.request.body
  if (!Validator.isPositiveInteger(sid)) {
    throw new CustomException('sid不合法')
  }

  await BlogCategoryModel.removeCategory(sid)
  await BlogArticleModel.updateArticleByCatid(sid, { sortid: -1 })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.listBlogCategoryAction = async (ctx) => {
  const result = await BlogCategoryModel.getCategories()

  ctx.body = {
    code: 0,
    msg: 'success',
    data: listToTree(result, 'sid', 'pid')
  }
}

exports.orderBlogCategoryAction = async (ctx) => {
  const { sid, taxis } = ctx.request.body
  if (!Validator.isPositiveInteger(sid)) {
    throw new CustomException('sid不合法')
  }

  await BlogCategoryModel.updateCategory(sid, { taxis })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
