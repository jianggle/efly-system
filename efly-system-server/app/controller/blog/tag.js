const BlogTagModel = require('@app/model/blog_tag')
const BlogArticleTagModel = require('@app/model/blog_article_tag')
const ParamCheck = require('@app/utils/paramCheck')
const Validator = require('@app/utils/validator')
const { responseSuccess, ServiceException } = require('@app/utils/resModel')

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
      throw new ServiceException(repeatMsg)
    }
    await BlogTagModel.update(params, { tid })
  } else {
    if (existItem) {
      throw new ServiceException(repeatMsg)
    }
    await BlogTagModel.create(params)
  }
  await responseSuccess(ctx)
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
  await responseSuccess(ctx)
}

exports.listBlogTagAction = async (ctx) => {
  const keyword = (ctx.request.query.keyword || '').trim()
  const result = await BlogTagModel.getList(false, keyword)
  await responseSuccess(ctx, result)
}
