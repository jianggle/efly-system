const CmsTagModel = require('@app/model/cms_tag')
const CmsArticleTagModel = require('@app/model/cms_article_tag')
const ParamCheck = require('@app/utils/paramCheck')
const Validator = require('@app/utils/validator')
const { responseSuccess, ServiceException } = require('@app/utils/resModel')

const handleEditTag = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    tagname: new ParamCheck().isRequired().min(2).max(60)
  })
  const { tid, tagname } = ctx.request.body
  const isUpdate = Validator.isModify(ctx, 'tid')
  const existItem = await CmsTagModel.findOne({ where: { tagname } })
  const repeatMsg = '标签已存在'
  const params = { tagname }
  if (isUpdate) {
    if (existItem && existItem.tid !== tid) {
      throw new ServiceException(repeatMsg)
    }
    await CmsTagModel.update(params, { tid })
  } else {
    if (existItem) {
      throw new ServiceException(repeatMsg)
    }
    await CmsTagModel.create(params)
  }
  await responseSuccess(ctx)
}

exports.addCmsTagAction = (ctx) => {
  return handleEditTag(ctx)
}

exports.modifyCmsTagAction = (ctx) => {
  return handleEditTag(ctx)
}

exports.removeCmsTagAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    tid: new ParamCheck().isRequired().isNumber().isPositiveInteger()
  })
  const { tid } = ctx.request.body
  await CmsTagModel.destroy({ tid })
  await CmsArticleTagModel.destroy({ tid })
  await responseSuccess(ctx)
}

exports.listCmsTagAction = async (ctx) => {
  const keyword = (ctx.request.query.keyword || '').trim()
  const result = await CmsTagModel.getList(false, keyword)
  await responseSuccess(ctx, result)
}
