const BlogArticleModel = require('@app/model/blog_article')
const BlogCategoryModel = require('@app/model/blog_category')
const BlogTagModel = require('@app/model/blog_tag')
const BlogArticleTagModel = require('@app/model/blog_article_tag')
const ParamCheck = require('@app/utils/paramCheck')
const Validator = require('@app/utils/validator')
const { responseSuccess, ServiceException } = require('@app/utils/resModel')
const { listToTree } = require('@app/utils')

const { uploadToQiniu } = require('@app/utils/qiniu')
const fs = require('fs')

const checkBlogType = async (val) => {
  if (!['blog', 'page'].includes(val)) {
    throw new ServiceException('type不合法')
  }
}

exports.listBlogArticleAction = async (ctx) => {
  let {
    type,
    status = '',
    catid,
    author,
    keyword,
  } = ctx.request.query

  await checkBlogType(type)
  if (status && !['n', 'y'].includes(status)) {
    throw new ServiceException('status不合法')
  }
  catid = catid * 1
  catid = (catid === -1 || Validator.isPositiveInteger(catid)) ? catid : null
  author = Validator.isPositiveInteger(author) ? author : null
  keyword = (keyword || '').trim()

  const [offset, limit] = Validator.formatPagingParams(ctx)
  const result = await BlogArticleModel.getList({
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

exports.updateBlogArticleStatusAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    gid: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    status: new ParamCheck().isRequired().pattern(/^(n|y)$/),
  })
  const { gid, status } = ctx.request.body
  await BlogArticleModel.update({ hide: status }, { gid })
  await responseSuccess(ctx)
}

exports.batchOperateBlogArticleAction = async (ctx) => {
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
    await BlogArticleModel.destroy({ gid: ids })
    await BlogArticleTagModel.destroy({ gid: ids })
  } else if (operate === 'move') {
    if (catid !== -1 && !Validator.isPositiveInteger(catid)) {
      throw new ServiceException('catid不合法')
    }
    await BlogArticleModel.update({ sortid: catid }, { gid: ids })
  } else {
    await BlogArticleModel.update({ hide: operate === 'publish' ? 'n' : 'y' }, { gid: ids })
  }

  await responseSuccess(ctx)
}

exports.infoBlogArticleAction = async (ctx) => {
  const { gid } = ctx.request.query
  let articleInfo = {}
  if (Validator.isPositiveInteger(gid)) {
    articleInfo = await BlogArticleModel.findOne({ where: { gid } })
    articleInfo.tags = await BlogArticleTagModel.getList(gid)
    articleInfo.tags = articleInfo.tags.map(item => item.tagname)
  }

  const optionTags = await BlogTagModel.getList(true)
  const optionCategories = await BlogCategoryModel.getList(true)

  await responseSuccess(ctx, {
    ...articleInfo,
    optionTags,
    optionCategories: listToTree(optionCategories, 'sid', 'pid'),
  })
}

const handleAddArticleTag = async (gid, tags) => {
  if (!Array.isArray(tags) || !tags.length) return
  const existTags = await BlogTagModel.getListByTagname(tags)
  const existNames = existTags.map(item => item.tagname)
  const addIds = existTags.map(item => item.tid)
  const newTags = tags.filter(item => !existNames.includes(item))
  // 创建新标签
  for(let tagname of newTags) {
    let { insertId } = await BlogTagModel.create({ tagname })
    addIds.push(insertId)
  }
  // 添加关联记录
  await BlogArticleTagModel.addList(gid, addIds)
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

  await checkBlogType(type)
  if (type === 'blog' && sortid !== -1 && !Validator.isPositiveInteger(sortid)) {
    throw new ServiceException('sortid不合法')
  }
  if (type === 'page') {
    sortid = -1
  }

  const isUpdate = Validator.isModify(ctx, 'gid')
  alias = Validator.formatAlias(alias)

  const newTags = (Array.isArray(tags) ? tags : []).filter(item => !!(item + '').trim())
  const existTitle = await BlogArticleModel.getOneArticle({ title })
  let existAlias = null
  if (alias) {
    existAlias = await BlogArticleModel.getOneArticle({ alias })
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

    const existTags = await BlogArticleTagModel.getList(gid, false)
    const oldTags = existTags.filter(item => item.tagname).map(item => item.tagname)
    // 旧标签没在新的里面，就是需要解除关联的
    const delTags = existTags.filter(item => !newTags.includes(item.tagname))
    const delIds = delTags.map(item => item.tid)
    if (delIds.length) {
      await BlogArticleTagModel.destroy({ gid, tid: delIds })
    }
    // 新标签没在旧的里面，就是需要添加关联的
    const addTags = newTags.filter(item => !oldTags.includes(item))
    await handleAddArticleTag(gid, addTags)

    await BlogArticleModel.update(params, { gid })
  } else {
    if (existTitle) {
      throw new ServiceException('标题已存在')
    }
    if (existAlias) {
      throw new ServiceException('别名已存在')
    }

    params.author = ctx.state.user.id

    const { insertId } = await BlogArticleModel.create(params)
    await handleAddArticleTag(insertId, newTags)
  }

  await responseSuccess(ctx)
}

exports.addBlogArticleAction = (ctx) => {
  return handleEditArticle(ctx)
}

exports.modifyBlogArticleAction = (ctx) => {
  return handleEditArticle(ctx)
}

exports.uploadFileAction = async (ctx) => {
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
