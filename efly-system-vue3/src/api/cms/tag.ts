import request, { ApiResponse } from '@/utils/request'

export function cms_tag_list<T>(params = {}) {
  return request<ApiResponse<T>>({
    method: 'get',
    url: 'cms/listCmsTag',
    params,
  })
}

export function cms_tag_remove<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/removeCmsTag',
    data,
  })
}

export function cms_tag_add<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/addCmsTag',
    data,
  })
}

export function cms_tag_modify<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/modifyCmsTag',
    data,
  })
}
