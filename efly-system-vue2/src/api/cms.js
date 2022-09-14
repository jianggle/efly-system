import request from '@/utils/request'

export function cms_upload_file(data) {
  return request({
    method: 'post',
    url: 'cms/uploadFile',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function list_cms_category(params) {
  return request({
    method: 'get',
    url: 'cms/listCmsCategory',
    params
  })
}
export function remove_cms_category(data) {
  return request({
    method: 'post',
    url: 'cms/removeCmsCategory',
    data
  })
}
export function add_cms_category(data) {
  return request({
    method: 'post',
    url: 'cms/addCmsCategory',
    data
  })
}
export function modify_cms_category(data) {
  return request({
    method: 'post',
    url: 'cms/modifyCmsCategory',
    data
  })
}
export function order_cms_category(data) {
  return request({
    method: 'post',
    url: 'cms/orderCmsCategory',
    data
  })
}

export function list_cms_tag(params) {
  return request({
    method: 'get',
    url: 'cms/listCmsTag',
    params
  })
}
export function remove_cms_tag(data) {
  return request({
    method: 'post',
    url: 'cms/removeCmsTag',
    data
  })
}
export function add_cms_tag(data) {
  return request({
    method: 'post',
    url: 'cms/addCmsTag',
    data
  })
}
export function modify_cms_tag(data) {
  return request({
    method: 'post',
    url: 'cms/modifyCmsTag',
    data
  })
}

export function list_cms_article(params) {
  return request({
    method: 'get',
    url: 'cms/listCmsArticle',
    params
  })
}
export function update_cms_article_status(data) {
  return request({
    method: 'post',
    url: 'cms/updateCmsArticleStatus',
    data
  })
}
export function batch_operate_cms_article(data) {
  return request({
    method: 'post',
    url: 'cms/batchOperateCmsArticle',
    data
  })
}
export function info_cms_article(params) {
  return request({
    method: 'get',
    url: 'cms/infoCmsArticle',
    params
  })
}
export function add_cms_article(data) {
  return request({
    method: 'post',
    url: 'cms/addCmsArticle',
    data
  })
}
export function modify_cms_article(data) {
  return request({
    method: 'post',
    url: 'cms/modifyCmsArticle',
    data
  })
}

export function list_cms_link_category(params) {
  return request({
    method: 'get',
    url: 'cms/listCmsLinkCategory',
    params
  })
}
export function remove_cms_link_category(data) {
  return request({
    method: 'post',
    url: 'cms/removeCmsLinkCategory',
    data
  })
}
export function add_cms_link_category(data) {
  return request({
    method: 'post',
    url: 'cms/addCmsLinkCategory',
    data
  })
}
export function modify_cms_link_category(data) {
  return request({
    method: 'post',
    url: 'cms/modifyCmsLinkCategory',
    data
  })
}
export function order_cms_link_category(data) {
  return request({
    method: 'post',
    url: 'cms/orderCmsLinkCategory',
    data
  })
}

export function list_cms_link(params) {
  return request({
    method: 'get',
    url: 'cms/listCmsLink',
    params
  })
}
export function add_cms_link(data) {
  return request({
    method: 'post',
    url: 'cms/addCmsLink',
    data
  })
}
export function modify_cms_link(data) {
  return request({
    method: 'post',
    url: 'cms/modifyCmsLink',
    data
  })
}
export function update_cms_link_status(data) {
  return request({
    method: 'post',
    url: 'cms/updateCmsLinkStatus',
    data
  })
}
export function order_cms_link(data) {
  return request({
    method: 'post',
    url: 'cms/orderCmsLink',
    data
  })
}
export function batch_operate_cms_link(data) {
  return request({
    method: 'post',
    url: 'cms/batchOperateCmsLink',
    data
  })
}
