const BlogArticleModel = require('@app/model/blog/article')
const BlogArticleTagModel = require('@app/model/blog/article-tag')
const BlogLinkCategoryModel = require('@app/model/blog/link-category')
const BlogLinkModel = require('@app/model/blog/link')
const BlogCategoryModel = require('@app/model/blog/category')

const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')

const Moment = require('moment')

const formatSummary = (content, number) => {
  if (!content) return ''
  const result = content.toString().replace(/<[^>]+>/g, '').replace(/\r|\n|\t/g, '').trim()
  return result && result.substring(0, number)
}

exports.listArticleAction = async (ctx) => {
  let {
    page,
    catid,
    author,
    keyword,
  } = ctx.request.query

  page = page * 1 || 1
  catid = catid * 1
  catid = Validator.isPositiveInteger(catid) ? catid : null
  author = Validator.isPositiveInteger(author) ? author : null
  keyword = (keyword || '').trim()

  const limit = 6
  const offset = (page - 1) * limit

  const result = await BlogArticleModel.getArticles({
    offset,
    limit,
    type: 'blog',
    status: 'n',
    catid,
    author,
    keyword,
    isFront: true
  })

  result.rows.forEach(item => {
    item.excerpt = item.excerpt || formatSummary(item.content, 300)
    delete item.content
  })

  const pageCount = Math.ceil(result.count / limit)
  const pageMin = Math.min(page, pageCount)
  const pageArr = []
  if (page > 1) {
    pageArr.push({ code: page - 1, name: '上' })
  }
  for (let i = pageMin - 2; i <= pageMin + 2 && i <= pageCount; i++) {
    if (i > 0) {
      pageArr.push({ code: i, name: i })
    }
  }
  if (page < pageCount) {
    pageArr.push({ code: page + 1, name: '下' })
  }
  const pageGroup = pageArr.map(item => {
    item.active = typeof item.name === 'number' && item.code === page
    item.url = `?page=${item.code}`
    if (catid) {
      item.url += `&catid=${catid}`
    }
    return item
  })

  const categories = await BlogCategoryModel.getCategories()
  const validCategory = categories.filter(item => item.count)

  await ctx.render('index', {
    data: result,
    pageGroup,
    catid,
    categories: validCategory
  })
}

exports.infoArticleAction = async (ctx) => {
  const alias = (ctx.params.id || '').trim()
  if (!alias) throw new CustomException('参数不合法')

  const gid = Validator.isPositiveInteger(alias) && alias
  const result = await BlogArticleModel.getPublicArticle(gid, alias)

  if (!result) throw new CustomException('资源不存在')

  const activeTime = Moment(result.createTime).format('YYYY-MM-DD HH:mm:ss')
  if (result.type === 'blog') {
    result.prev = await BlogArticleModel.getNeighborArticle(activeTime, false)
    result.next = await BlogArticleModel.getNeighborArticle(activeTime, true)
  }
  result.tags = await BlogArticleTagModel.getArticleTags(result.gid)
  result.excerpt = result.excerpt || formatSummary(result.content, 140)

  await ctx.render('detail', {
    data: result
  })
}

exports.listLinkAllAction = async (ctx) => {
  const result = await BlogLinkCategoryModel.getCategories(true)
  for (const item of result) {
    item.links = await BlogLinkModel.getLinksByCatid(item.catid)
    item.count = item.links.length
  }
  await ctx.render('link', {
    data: result.filter(item => item.count)
  })
}