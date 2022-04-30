const BlogTagModel = require('@app/model/blog_tag')
const BlogArticleTagModel = require('@app/model/blog_article_tag')
const ParamCheck = require('@app/utils/paramCheck')
const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')

const handleEditTag = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    tagname: new ParamCheck().isRequired().min(2).max(60)
  })
  const { tid, tagname } = ctx.request.body
  const isUpdate = Validator.isModify(ctx, 'tid')
  const existItem = await BlogTagModel.findOne({ where: { tagname } })
  const repeatMsg = '标签已存在'
  const params = { tagname }
  if (isUpdate) {
    if (existItem && existItem.tid !== tid) {
      throw new CustomException(repeatMsg)
    }
    await BlogTagModel.update(params, { tid })
  } else {
    if (existItem) {
      throw new CustomException(repeatMsg)
    }
    await BlogTagModel.create(params)
  }
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.addBlogTagAction = (ctx) => {
  return handleEditTag(ctx)
}

exports.modifyBlogTagAction = (ctx) => {
  return handleEditTag(ctx)
}

exports.removeBlogTagAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    tid: new ParamCheck().isRequired().isNumber().isPositiveInteger()
  })
  const { tid } = ctx.request.body
  await BlogTagModel.destroy({ tid })
  await BlogArticleTagModel.destroy({ tid })
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.listBlogTagAction = async (ctx) => {
  const keyword = (ctx.request.query.keyword || '').trim()
  const result = await BlogTagModel.getList(false, keyword)
  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}
