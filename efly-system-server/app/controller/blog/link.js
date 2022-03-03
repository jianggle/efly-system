const BlogLinkModel = require('@app/model/blog_link')

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
  const { id, status } = ctx.request.body
  if (!Validator.isPositiveInteger(id)) {
    throw new CustomException('id不合法')
  }
  if (!['n', 'y'].includes(status)) {
    throw new CustomException('status不合法')
  }

  await BlogLinkModel.update({ hide: status }, { id })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.orderBlogLinkAction = async (ctx) => {
  const { id, taxis } = ctx.request.body
  if (!Validator.isPositiveInteger(id)) {
    throw new CustomException('id不合法')
  }

  await BlogLinkModel.update({ taxis }, { id })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.batchOperateBlogLinkAction = async (ctx) => {
  const { operate, ids, catid } = ctx.request.body
  if (!['publish', 'hide', 'remove', 'move'].includes(operate)) {
    throw new CustomException('operate不合法')
  }
  if (!Array.isArray(ids) || !ids.length) {
    throw new CustomException('ids不合法')
  }
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
