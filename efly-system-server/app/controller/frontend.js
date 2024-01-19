import CmsArticleModel from '#model/cms_article.js'
import CmsArticleTagModel from '#model/cms_article_tag.js'
import CmsLinkCategoryModel from '#model/cms_link_category.js'
import CmsLinkModel from '#model/cms_link.js'
import CmsCategoryModel from '#model/cms_category.js'

import Validator from '#utils/validator.js'
import { ServiceException } from '#utils/resModel.js'

import dayjs from 'dayjs'

const formatSummary = (content, number) => {
  if (!content) return ''
  const result = content
    .toString()
    .replace(/<[^>]+>/g, '')
    .replace(/\r|\n|\t/g, '')
    .trim()
  return result && result.substring(0, number)
}

const getFirstImg = function (content) {
  if (!content) return
  let imgArr = content.match(/<img.*?(?:>|\/>)/gi)
  if (!Array.isArray(imgArr) || !imgArr.length) return
  for (let i = 0; i < imgArr.length; i++) {
    let src = imgArr[i].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)
    if (src[1]) return src[1]
  }
}

export const listArticleAction = async (ctx) => {
  let { page, catid, author, keyword } = ctx.request.query

  page = page * 1 || 1
  catid = catid * 1
  catid = Validator.isPositiveInteger(catid) ? catid : null
  author = Validator.isPositiveInteger(author) ? author : null
  keyword = (keyword || '').trim()

  const limit = 6
  const offset = (page - 1) * limit

  const result = await CmsArticleModel.getList({
    offset,
    limit,
    type: 'blog',
    status: 'n',
    catid,
    author,
    keyword,
    isFront: true,
  })

  result.rows.forEach((item) => {
    item.cover = getFirstImg(item.content) || ''
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
  const pageGroup = pageArr.map((item) => {
    item.active = typeof item.name === 'number' && item.code === page
    item.url = `?page=${item.code}`
    if (catid) {
      item.url += `&catid=${catid}`
    }
    return item
  })

  const categories = await CmsCategoryModel.getList()
  const validCategory = categories.filter((item) => item.count)

  await ctx.render('index', {
    data: result,
    pageGroup,
    catid,
    categories: validCategory,
  })
}

export const infoArticleAction = async (ctx) => {
  const alias = (ctx.params.id || '').trim()
  if (!alias) throw new ServiceException('参数不合法')

  const gid = Validator.isPositiveInteger(alias) && alias
  const result = await CmsArticleModel.getPublicArticle(gid, alias)

  if (!result) throw new ServiceException('资源不存在')

  const activeTime = dayjs(result.createTime).format('YYYY-MM-DD HH:mm:ss')
  if (result.type === 'blog') {
    result.prev = await CmsArticleModel.getNeighborArticle(activeTime, false)
    result.next = await CmsArticleModel.getNeighborArticle(activeTime, true)
  }
  result.tags = await CmsArticleTagModel.getList(result.gid)
  result.excerpt = result.excerpt || formatSummary(result.content, 140)

  await ctx.render('detail', {
    data: result,
  })
}

export const listLinkAllAction = async (ctx) => {
  const result = await CmsLinkCategoryModel.getList(true)
  for (const item of result) {
    item.links = await CmsLinkModel.getListByCatid(item.catid)
    item.count = item.links.length
  }
  await ctx.render('link', {
    data: result.filter((item) => item.count),
  })
}
