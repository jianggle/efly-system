import request, { ApiResponse } from '@/utils/request'

export function cms_category_list<T>(params = {}) {
  return request<ApiResponse<T>>({
    method: 'get',
    url: 'cms/listCmsCategory',
    params,
  })
}

export function cms_category_remove<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/removeCmsCategory',
    data,
  })
}

export function cms_category_add<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/addCmsCategory',
    data,
  })
}

export function cms_category_modify<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/modifyCmsCategory',
    data,
  })
}

export function cms_category_order<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/orderCmsCategory',
    data,
  })
}
