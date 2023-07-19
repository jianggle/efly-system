import CmsLinkModel from '#model/cms_link.js'
import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess, ServiceException } from '#utils/resModel.js'

export const listCmsLinkAction = async (ctx) => {
  let {
    status = '',
    catid = null,
    keyword = '',
  } = ctx.request.query

  catid = Validator.isPositiveInteger(catid) ? catid : null
  keyword = (keyword || '').trim()

  const [offset, limit] = Validator.formatPagingParams(ctx)
  const result = await CmsLinkModel.getList(offset, limit, status, catid, keyword)

  await responseSuccess(ctx, result)
}

const handleEditLink = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    taxis: new ParamCheck().isRequired().isNumber().min(0).max(9999),
    sitename: new ParamCheck().isRequired().min(2).max(60),
    siteurl: new ParamCheck().isRequired().max(255),
    catid: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    description: new ParamCheck().isRequired().max(140),
    hide: new ParamCheck().isRequired().pattern(/^(n|y)$/),
  })

  let {
    id,
    taxis = 0,
    sitename = '',
    siteurl = '',
    catid,
    description = '',
    hide = 'y',
  } = ctx.request.body

  const isUpdate = Validator.isModify(ctx, 'id')

  const existName = await CmsLinkModel.findOne({ where: { sitename } })
  const existUrl = await CmsLinkModel.findOne({ where: { siteurl } })
  if (existName && (!isUpdate || existName.id !== id)) {
    throw new ServiceException(`名称已存在，其链接是“${existName.siteurl}”`)
  }
  if (existUrl && (!isUpdate || existUrl.id !== id)) {
    throw new ServiceException(`链接已存在，其名称是“${existUrl.sitename}”`)
  }

  const params = {
    taxis,
    sitename,
    siteurl,
    catid,
    description,
    hide,
  }

  if (isUpdate) {
    await CmsLinkModel.update(params, { id })
  } else {
    await CmsLinkModel.create(params)
  }

  await responseSuccess(ctx)
}

export const addCmsLinkAction = (ctx) => {
  return handleEditLink(ctx)
}

export const modifyCmsLinkAction = (ctx) => {
  return handleEditLink(ctx)
}

export const updateCmsLinkStatusAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    id: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    status: new ParamCheck().isRequired().pattern(/^(n|y)$/),
  })
  const { id, status } = ctx.request.body
  await CmsLinkModel.update({ hide: status }, { id })
  await responseSuccess(ctx)
}

export const orderCmsLinkAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    id: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    taxis: new ParamCheck().isRequired().isNumber().min(0).max(9999)
  })
  const { id, taxis } = ctx.request.body
  await CmsLinkModel.update({ taxis }, { id })
  await responseSuccess(ctx)
}

export const batchOperateCmsLinkAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    operate: new ParamCheck().isRequired().pattern(/^(publish|hide|remove|move)$/),
    ids: new ParamCheck().isRequired().isArray().min(1)
  })

  const { operate, ids, catid } = ctx.request.body
  ids.forEach(item => {
    if (!Validator.isPositiveInteger(item)) {
      throw new ServiceException('ids不合法')
    }
  })

  if (operate === 'remove') {
    await CmsLinkModel.destroy({ id: ids })
  } else if (operate === 'move') {
    if (catid !== -1 && !Validator.isPositiveInteger(catid)) {
      throw new ServiceException('catid不合法')
    }
    await CmsLinkModel.update({ catid }, { id: ids })
  } else {
    await CmsLinkModel.update({ hide: operate === 'publish' ? 'n' : 'y' }, { id: ids })
  }

  await responseSuccess(ctx)
}
