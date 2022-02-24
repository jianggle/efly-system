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

export function list_blog_link_category(params) {
  return request({
    method: 'get',
    url: 'blog/listBlogLinkCategory',
    params
  })
}
export function remove_blog_link_category(data) {
  return request({
    method: 'post',
    url: 'blog/removeBlogLinkCategory',
    data
  })
}
export function add_blog_link_category(data) {
  return request({
    method: 'post',
    url: 'blog/addBlogLinkCategory',
    data
  })
}
export function modify_blog_link_category(data) {
  return request({
    method: 'post',
    url: 'blog/modifyBlogLinkCategory',
    data
  })
}
export function order_blog_link_category(data) {
  return request({
    method: 'post',
    url: 'blog/orderBlogLinkCategory',
    data
  })
}

export function list_blog_link(params) {
  return request({
    method: 'get',
    url: 'blog/listBlogLink',
    params
  })
}
export function remove_blog_link(data) {
  return request({
    method: 'post',
    url: 'blog/removeBlogLink',
    data
  })
}
export function add_blog_link(data) {
  return request({
    method: 'post',
    url: 'blog/addBlogLink',
    data
  })
}
export function modify_blog_link(data) {
  return request({
    method: 'post',
    url: 'blog/modifyBlogLink',
    data
  })
}
export function update_blog_link_status(data) {
  return request({
    method: 'post',
    url: 'blog/updateBlogLinkStatus',
    data
  })
}
