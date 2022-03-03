const BlogCategoryModel = require('@app/model/blog_category')
const BlogArticleModel = require('@app/model/blog_article')

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

  const existItem = await BlogCategoryModel.findOne({ where: { sortname } })
  let existAlias = null
  if (alias) {
    existAlias = await BlogCategoryModel.findOne({ where: { alias } })
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

    await BlogCategoryModel.update(params, { sid })
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

  await BlogCategoryModel.destroy({ sid })
  await BlogArticleModel.update({ sortid: -1 }, { sortid: sid })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.listBlogCategoryAction = async (ctx) => {
  const result = await BlogCategoryModel.getList()

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

  await BlogCategoryModel.update({ taxis }, { sid })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
