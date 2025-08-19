import CmsTagModel from '../model/CmsTagModel.js'
import CmsArticleTagModel from '../model/CmsArticleTagModel.js'

import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess, ServiceException } from '#utils/resModel.js'

const handleEditTag = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    tagname: new ParamCheck().isRequired().min(2).max(60),
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

export const addCmsTagAction = (ctx) => {
  return handleEditTag(ctx)
}

export const modifyCmsTagAction = (ctx) => {
  return handleEditTag(ctx)
}

export const removeCmsTagAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    tid: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
  })
  const { tid } = ctx.request.body
  await CmsTagModel.destroy({ tid })
  await CmsArticleTagModel.destroy({ tid })
  await responseSuccess(ctx)
}

export const listCmsTagAction = async (ctx) => {
  const keyword = (ctx.request.query.keyword || '').trim()
  const result = await CmsTagModel.getList(false, keyword)
  await responseSuccess(ctx, result)
}
