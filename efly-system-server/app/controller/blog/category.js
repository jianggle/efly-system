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
  alias = Validator.formatAlias(alias)

  const existItem = await BlogCategoryModel.getOneCategory({ sortname })
  let existAlias = null
  if (alias) {
    existAlias = await BlogCategoryModel.getOneCategory({ alias })
  }

  const params = {
    pid,
    taxis,
    sortname,
    alias,
    description
  }

  if (isUpdate) {
    if (existItem && existItem.sid !== sid) {
      throw new CustomException('名称已存在')
    }
    if (existAlias && existAlias.sid !== sid) {
      throw new CustomException('别名已存在')
    }

    await BlogCategoryModel.updateCategory(sid, params)
  } else {
    if (existItem) {
      throw new CustomException('名称已存在')
    }
    if (existAlias) {
      throw new CustomException('别名已存在')
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
