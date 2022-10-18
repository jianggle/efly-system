import request, { ApiResponse, ApiListRes } from '@/utils/request'

export function cms_article_list<T>(params = {}) {
  return request<ApiResponse<ApiListRes<T>>>({
    method: 'get',
    url: 'cms/listCmsArticle',
    params,
  })
}

export function cms_article_add<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/addCmsArticle',
    data,
  })
}

export function cms_article_modify<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/modifyCmsArticle',
    data,
  })
}

export function cms_article_info<T>(params = {}) {
  return request<ApiResponse<T>>({
    method: 'get',
    url: 'cms/infoCmsArticle',
    params,
  })
}

export function cms_article_updateStatus<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/updateCmsArticleStatus',
    data,
  })
}

export function cms_article_batchOperate<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/batchOperateCmsArticle',
    data,
  })
}
