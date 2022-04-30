const BlogLinkModel = require('@app/model/blog_link')
const ParamCheck = require('@app/utils/paramCheck')
const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')

exports.listBlogLinkAction = async (ctx) => {
  let {
    status = '',
    catid = null,
    keyword = '',
  } = ctx.request.query

  catid = Validator.isPositiveInteger(catid) ? catid : null
  keyword = (keyword || '').trim()

  const [offset, limit] = Validator.formatPagingParams(ctx)
  const result = await BlogLinkModel.getList(offset, limit, status, catid, keyword)

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
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

  const existName = await BlogLinkModel.findOne({ where: { sitename } })
  const existUrl = await BlogLinkModel.findOne({ where: { siteurl } })
  if (existName && (!isUpdate || existName.id !== id)) {
    throw new CustomException(`名称已存在，其链接是“${existName.siteurl}”`)
  }
  if (existUrl && (!isUpdate || existUrl.id !== id)) {
    throw new CustomException(`链接已存在，其名称是“${existUrl.sitename}”`)
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
    await BlogLinkModel.update(params, { id })
  } else {
    await BlogLinkModel.create(params)
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.addBlogLinkAction = (ctx) => {
  return handleEditLink(ctx)
}

exports.modifyBlogLinkAction = (ctx) => {
  return handleEditLink(ctx)
}

exports.updateBlogLinkStatusAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    id: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    status: new ParamCheck().isRequired().pattern(/^(n|y)$/),
  })
  const { id, status } = ctx.request.body
  await BlogLinkModel.update({ hide: status }, { id })
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.orderBlogLinkAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    id: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    taxis: new ParamCheck().isRequired().isNumber().min(0).max(9999)
  })
  const { id, taxis } = ctx.request.body
  await BlogLinkModel.update({ taxis }, { id })
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.batchOperateBlogLinkAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    operate: new ParamCheck().isRequired().pattern(/^(publish|hide|remove|move)$/),
    ids: new ParamCheck().isRequired().isArray().min(1)
  })

  const { operate, ids, catid } = ctx.request.body
  ids.forEach(item => {
    if (!Validator.isPositiveInteger(item)) {
      throw new CustomException('ids不合法')
    }
  })

  if (operate === 'remove') {
    await BlogLinkModel.destroy({ id: ids })
  } else if (operate === 'move') {
    if (catid !== -1 && !Validator.isPositiveInteger(catid)) {
      throw new CustomException('catid不合法')
    }
    await BlogLinkModel.update({ catid }, { id: ids })
  } else {
    await BlogLinkModel.update({ hide: operate === 'publish' ? 'n' : 'y' }, { id: ids })
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
