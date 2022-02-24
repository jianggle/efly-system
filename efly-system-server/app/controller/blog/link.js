const BlogLinkModel = require('@app/model/blog/link')

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
  const result = await BlogLinkModel.getLinks(offset, limit, status, catid, keyword)

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

const handleEditLink = async (ctx) => {
  let {
    id,
    taxis = 0,
    sitename = '',
    siteurl = '',
    catid,
    description = '',
    hide = 'y',
  } = ctx.request.body

  if (!Validator.isPositiveInteger(catid)) {
    throw new CustomException('catid不合法')
  }
  if (!['n', 'y'].includes(hide)) {
    throw new CustomException('hide不合法')
  }
  const isUpdate = Validator.isModify(ctx, 'id')

  const existName = await BlogLinkModel.getOneLink({ sitename })
  const existUrl = await BlogLinkModel.getOneLink({ siteurl })
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
    await BlogLinkModel.updateLinkById(id, params)
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

exports.removeBlogLinkAction = async (ctx) => {
  const { id } = ctx.request.body
  if (!Validator.isPositiveInteger(id)) {
    throw new CustomException('id不合法')
  }

  await BlogLinkModel.removeLinkById(id)

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.updateBlogLinkStatusAction = async (ctx) => {
  const { id, status } = ctx.request.body
  if (!Validator.isPositiveInteger(id)) {
    throw new CustomException('id不合法')
  }
  if (!['n', 'y'].includes(status)) {
    throw new CustomException('status不合法')
  }

  await BlogLinkModel.updateLinkById(id, {
    hide: status
  })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
