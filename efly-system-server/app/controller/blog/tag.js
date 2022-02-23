const BlogTagModel = require('@app/model/blog/tag')
const BlogArticleTagModel = require('@app/model/blog/article-tag')

const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')

const handleEditTag = async (ctx) => {
  let {
    tid,
    tagname,
  } = ctx.request.body

  const isUpdate = Validator.isModify(ctx, 'tid')

  let params = {
    tagname,
  }

  const existItem = await BlogTagModel.getTagByName(tagname)
  const repeatMsg = '标签已存在'

  if (isUpdate) {
    if (existItem && existItem.tid !== tid) {
      throw new CustomException(repeatMsg)
    }
    await BlogTagModel.updateTag(tid, params)
  } else {
    if (existItem) {
      throw new CustomException(repeatMsg)
    }
    await BlogTagModel.create(params)
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.addBlogTagAction = (ctx) => {
  return handleEditTag(ctx)
}

exports.modifyBlogTagAction = (ctx) => {
  return handleEditTag(ctx)
}

exports.removeBlogTagAction = async (ctx) => {
  const { tid } = ctx.request.body
  if (!Validator.isPositiveInteger(tid)) {
    throw new CustomException('tid不合法')
  }

  await BlogTagModel.removeTag(tid)
  await BlogArticleTagModel.removeArticleTagsByTid(tid)

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.listBlogTagAction = async (ctx) => {
  let {
    keyword,
  } = ctx.request.query

  const result = await BlogTagModel.getTags(false, keyword)

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}
