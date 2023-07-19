import CmsArticleModel from '#model/cms_article.js'
import CmsCategoryModel from '#model/cms_category.js'
import CmsTagModel from '#model/cms_tag.js'
import CmsArticleTagModel from '#model/cms_article_tag.js'
import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess, ServiceException } from '#utils/resModel.js'
import { listToTree } from '#utils/index.js'

import { uploadToQiniu } from '#utils/qiniu.js'
import fs from 'fs'

const checkArticleType = async (val) => {
  if (!['blog', 'page'].includes(val)) {
    throw new ServiceException('type不合法')
  }
}

export const listCmsArticleAction = async (ctx) => {
  let {
    type,
    status = '',
    catid,
    author,
    keyword,
  } = ctx.request.query

  await checkArticleType(type)
  if (status && !['n', 'y'].includes(status)) {
    throw new ServiceException('status不合法')
  }
  catid = catid * 1
  catid = (catid === -1 || Validator.isPositiveInteger(catid)) ? catid : null
  author = Validator.isPositiveInteger(author) ? author : null
  keyword = (keyword || '').trim()

  const [offset, limit] = Validator.formatPagingParams(ctx)
  const result = await CmsArticleModel.getList({
    offset,
    limit,
    type,
    status,
    catid,
    author,
    keyword
  })

  await responseSuccess(ctx, result)
}

export const updateCmsArticleStatusAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    gid: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    status: new ParamCheck().isRequired().pattern(/^(n|y)$/),
  })
  const { gid, status } = ctx.request.body
  await CmsArticleModel.update({ hide: status }, { gid })
  await responseSuccess(ctx)
}

export const batchOperateCmsArticleAction = async (ctx) => {
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
    await CmsArticleModel.destroy({ gid: ids })
    await CmsArticleTagModel.destroy({ gid: ids })
  } else if (operate === 'move') {
    if (catid !== -1 && !Validator.isPositiveInteger(catid)) {
      throw new ServiceException('catid不合法')
    }
    await CmsArticleModel.update({ sortid: catid }, { gid: ids })
  } else {
    await CmsArticleModel.update({ hide: operate === 'publish' ? 'n' : 'y' }, { gid: ids })
  }

  await responseSuccess(ctx)
}

export const infoCmsArticleAction = async (ctx) => {
  const { gid } = ctx.request.query
  let articleInfo = {}
  if (Validator.isPositiveInteger(gid)) {
    articleInfo = await CmsArticleModel.findOne({ where: { gid } })
    articleInfo.tags = await CmsArticleTagModel.getList(gid)
    articleInfo.tags = articleInfo.tags.map(item => item.tagname)
  }

  const optionTags = await CmsTagModel.getList(true)
  const optionCategories = await CmsCategoryModel.getList(true)

  await responseSuccess(ctx, {
    ...articleInfo,
    optionTags,
    optionCategories: listToTree(optionCategories, 'sid', 'pid'),
  })
}

const handleAddArticleTag = async (gid, tags) => {
  if (!Array.isArray(tags) || !tags.length) return
  const existTags = await CmsTagModel.getListByTagname(tags)
  const existNames = existTags.map(item => item.tagname)
  const addIds = existTags.map(item => item.tid)
  const newTags = tags.filter(item => !existNames.includes(item))
  // 创建新标签
  for(let tagname of newTags) {
    let { insertId } = await CmsTagModel.create({ tagname })
    addIds.push(insertId)
  }
  // 添加关联记录
  await CmsArticleTagModel.addList(gid, addIds)
}

const handleEditArticle = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    hide: new ParamCheck().isRequired().isBoolean(),
    allowRemark: new ParamCheck().isRequired().isBoolean(),
    top: new ParamCheck().isRequired().isBoolean(),
    sortop: new ParamCheck().isRequired().isBoolean(),
  })

  let {
    gid,
    title,
    excerpt,
    alias,
    content,
    sortid,
    type,
    hide,
    allowRemark,
    top,
    sortop,
    tags,
  } = ctx.request.body

  await checkArticleType(type)
  if (type === 'blog' && sortid !== -1 && !Validator.isPositiveInteger(sortid)) {
    throw new ServiceException('sortid不合法')
  }
  if (type === 'page') {
    sortid = -1
  }

  const isUpdate = Validator.isModify(ctx, 'gid')
  alias = Validator.formatAlias(alias)

  const newTags = (Array.isArray(tags) ? tags : []).filter(item => !!(item + '').trim())
  const existTitle = await CmsArticleModel.getOneArticle({ title })
  let existAlias = null
  if (alias) {
    existAlias = await CmsArticleModel.getOneArticle({ alias })
  }

  const params = {
    title,
    excerpt,
    alias,
    content,
    sortid,
    type,
    hide: hide ? 'y' : 'n',
    allowRemark: allowRemark ? 'y' : 'n',
    top: top ? 'y' : 'n',
    sortop: sortop ? 'y' : 'n',
  }

  if (isUpdate) {
    if (existTitle && existTitle.gid !== gid) {
      throw new ServiceException('标题已存在')
    }
    if (existAlias && existAlias.gid !== gid) {
      throw new ServiceException('别名已存在')
    }

    const existTags = await CmsArticleTagModel.getList(gid, false)
    const oldTags = existTags.filter(item => item.tagname).map(item => item.tagname)
    // 旧标签没在新的里面，就是需要解除关联的
    const delTags = existTags.filter(item => !newTags.includes(item.tagname))
    const delIds = delTags.map(item => item.tid)
    if (delIds.length) {
      await CmsArticleTagModel.destroy({ gid, tid: delIds })
    }
    // 新标签没在旧的里面，就是需要添加关联的
    const addTags = newTags.filter(item => !oldTags.includes(item))
    await handleAddArticleTag(gid, addTags)

    await CmsArticleModel.update(params, { gid })
  } else {
    if (existTitle) {
      throw new ServiceException('标题已存在')
    }
    if (existAlias) {
      throw new ServiceException('别名已存在')
    }

    params.author = ctx.state.user.id

    const { insertId } = await CmsArticleModel.create(params)
    await handleAddArticleTag(insertId, newTags)
  }

  await responseSuccess(ctx)
}

export const addCmsArticleAction = (ctx) => {
  return handleEditArticle(ctx)
}

export const modifyCmsArticleAction = (ctx) => {
  return handleEditArticle(ctx)
}

export const uploadFileAction = async (ctx) => {
  // 获取临时路径
  const localPath = ctx.file.path
  const { scene } = ctx.request.body
  if (!scene) {
    // 删除临时文件
    fs.unlinkSync(localPath)
    throw new ServiceException('参数不合法')
  }
  // 上传到七牛
  const reader = fs.createReadStream(localPath)
  const fileName = `${scene}_${ctx.file.filename}`
  const result = await uploadToQiniu(reader, fileName)
  // 删除临时文件
  fs.unlinkSync(localPath)
  await responseSuccess(ctx, result.fileUrl)
}
