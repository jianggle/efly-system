import request from '@/utils/request'

export function list_blog_category(params) {
  return request({
    method: 'get',
    url: 'blog/listBlogCategory',
    params
  })
}
export function remove_blog_category(data) {
  return request({
    method: 'post',
    url: 'blog/removeBlogCategory',
    data
  })
}
export function add_blog_category(data) {
  return request({
    method: 'post',
    url: 'blog/addBlogCategory',
    data
  })
}
export function modify_blog_category(data) {
  return request({
    method: 'post',
    url: 'blog/modifyBlogCategory',
    data
  })
}
export function order_blog_category(data) {
  return request({
    method: 'post',
    url: 'blog/orderBlogCategory',
    data
  })
}

export function list_blog_tag(params) {
  return request({
    method: 'get',
    url: 'blog/listBlogTag',
    params
  })
}
export function remove_blog_tag(data) {
  return request({
    method: 'post',
    url: 'blog/removeBlogTag',
    data
  })
}
export function add_blog_tag(data) {
  return request({
    method: 'post',
    url: 'blog/addBlogTag',
    data
  })
}
export function modify_blog_tag(data) {
  return request({
    method: 'post',
    url: 'blog/modifyBlogTag',
    data
  })
}

export function list_blog_article(params) {
  return request({
    method: 'get',
    url: 'blog/listBlogArticle',
    params
  })
}
export function update_blog_article_status(data) {
  return request({
    method: 'post',
    url: 'blog/updateBlogArticleStatus',
    data
  })
}
export function batch_operate_blog_article(data) {
  return request({
    method: 'post',
    url: 'blog/batchOperateBlogArticle',
    data
  })
}
export function info_blog_article(params) {
  return request({
    method: 'get',
    url: 'blog/infoBlogArticle',
    params
  })
}
export function add_blog_article(data) {
  return request({
    method: 'post',
    url: 'blog/addBlogArticle',
    data
  })
}
export function modify_blog_article(data) {
  return request({
    method: 'post',
    url: 'blog/modifyBlogArticle',
    data
  })
}
