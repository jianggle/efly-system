const BlogArticleModel = require('@app/model/blog/article')
const BlogCategoryModel = require('@app/model/blog/category')
const BlogTagModel = require('@app/model/blog/tag')
const BlogArticleTagModel = require('@app/model/blog/article-tag')

const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')
const { listToTree } = require('@app/utils')

const checkBlogType = async (val) => {
  if (!['blog', 'page'].includes(val)) {
    throw new CustomException('type不合法')
  }
}

exports.listBlogArticleAction = async (ctx) => {
  let {
    type,
    catid,
    author,
    keyword,
  } = ctx.request.query

  await checkBlogType(type)
  catid = Validator.isPositiveInteger(catid) ? catid : null
  author = Validator.isPositiveInteger(author) ? author : null
  keyword = (keyword || '').trim()

  const [offset, limit] = Validator.formatPagingParams(ctx)
  const result = await BlogArticleModel.getArticles(offset, limit, type, catid, author, keyword)

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

exports.updateBlogArticleStatusAction = async (ctx) => {
  const { gid, status } = ctx.request.body
  if (!Validator.isPositiveInteger(gid)) {
    throw new CustomException('gid不合法')
  }
  if (!['n', 'y'].includes(status)) {
    throw new CustomException('status不合法')
  }

  await BlogArticleModel.updateArticleById(gid, {
    hide: status
  })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.batchOperateBlogArticleAction = async (ctx) => {
  const { operate, ids } = ctx.request.body
  if (!['publish', 'hide', 'remove'].includes(operate)) {
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
    await BlogArticleModel.removeArticle(ids)
    await BlogArticleTagModel.removeArticleTagsByGid(ids)
  } else {
    await BlogArticleModel.updateArticleById(ids, {
      hide: operate === 'publish' ? 'n' : 'y'
    })
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.infoBlogArticleAction = async (ctx) => {
  const { gid } = ctx.request.query

  let articleInfo = {}
  if (Validator.isPositiveInteger(gid)) {
    articleInfo = await BlogArticleModel.getArticleById(gid)
    articleInfo.tags = await BlogArticleTagModel.getArticleTags(gid)
    articleInfo.tags = articleInfo.tags.map(item => item.tagname)
  }

  const optionTags = await BlogTagModel.getTags(true)
  const optionCategories = await BlogCategoryModel.getCategories(true)

  ctx.body = {
    code: 0,
    msg: 'success',
    data: {
      ...articleInfo,
      optionTags,
      optionCategories: listToTree(optionCategories, 'sid', 'pid'),
    }
  }
}

const handleAddArticleTag = async (gid, tags) => {
  if (!Array.isArray(tags) || !tags.length) return
  const existTags = await BlogTagModel.getTagsByName(tags)
  const existNames = existTags.map(item => item.tagname)
  const addIds = existTags.map(item => item.tid)
  const newTags = tags.filter(item => !existNames.includes(item))
  // 创建新标签
  for(let tagname of newTags) {
    let { insertId } = await BlogTagModel.create({ tagname })
    addIds.push(insertId)
  }
  // 添加关联记录
  await BlogArticleTagModel.addArticleTags(gid, addIds)
}

const handleEditArticle = async (ctx) => {
  let {
    gid,
    title,
    excerpt,
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
  if (type === 'blog' && !Validator.isPositiveInteger(sortid)) {
    throw new CustomException('sortid不合法')
  }
  if (type === 'page') {
    sortid = -1
  }
  if (!Validator.isBoolean(hide)) throw new CustomException('hide不合法')
  if (!Validator.isBoolean(allowRemark)) throw new CustomException('allowRemark不合法')
  if (!Validator.isBoolean(top)) throw new CustomException('top不合法')
  if (!Validator.isBoolean(sortop)) throw new CustomException('sortop不合法')

  const isUpdate = Validator.isModify(ctx, 'gid')

  let params = {
    title,
    excerpt,
    content,
    sortid,
    type,
    hide: hide ? 'y' : 'n',
    allowRemark: allowRemark ? 'y' : 'n',
    top: top ? 'y' : 'n',
    sortop: sortop ? 'y' : 'n',
  }

  const newTags = (Array.isArray(tags) ? tags : []).filter(item => !!(item + '').trim())
  const existItem = await BlogArticleModel.selectRepeat(title)
  const repeatMsg = '标题已存在'

  if (isUpdate) {
    if (existItem && existItem.gid !== gid) {
      throw new CustomException(repeatMsg)
    }

    const existTags = await BlogArticleTagModel.getArticleTags(gid, false)
    const oldTags = existTags.filter(item => item.tagname).map(item => item.tagname)
    // 旧标签没在新的里面，就是需要解除关联的
    const delTags = existTags.filter(item => !newTags.includes(item.tagname))
    const delIds = delTags.map(item => item.tid)
    if (delIds.length) {
      await BlogArticleTagModel.removeArticleTagsByFull(gid, delIds)
    }
    // 新标签没在旧的里面，就是需要添加关联的
    const addTags = newTags.filter(item => !oldTags.includes(item))
    await handleAddArticleTag(gid, addTags)

    await BlogArticleModel.updateArticleById(gid, params)
  } else {
    if (existItem) {
      throw new CustomException(repeatMsg)
    }

    params.author = ctx.state.userId

    const { insertId } = await BlogArticleModel.create(params)
    await handleAddArticleTag(insertId, newTags)
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.addBlogArticleAction = (ctx) => {
  return handleEditArticle(ctx)
}

exports.modifyBlogArticleAction = (ctx) => {
  return handleEditArticle(ctx)
}