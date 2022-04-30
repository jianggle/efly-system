const BlogCategoryModel = require('@app/model/blog_category')
const BlogArticleModel = require('@app/model/blog_article')
const ParamCheck = require('@app/utils/paramCheck')
const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')
const { listToTree } = require('@app/utils')

const handleEditCategory = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    pid: new ParamCheck().isRequired().isNumber().min(0),
    taxis: new ParamCheck().isRequired().isNumber().min(0).max(9999),
    sortname: new ParamCheck().isRequired().min(2).max(60),
    alias: new ParamCheck().isRequired().max(200),
    description: new ParamCheck().isRequired().max(140),
  })

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
  await ParamCheck.check(ctx.request.body, {
    sid: new ParamCheck().isRequired().isNumber().isPositiveInteger()
  })
  const { sid } = ctx.request.body
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
  await ParamCheck.check(ctx.request.body, {
    sid: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    taxis: new ParamCheck().isRequired().isNumber().min(0).max(9999)
  })
  const { sid, taxis } = ctx.request.body
  await BlogCategoryModel.update({ taxis }, { sid })
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
