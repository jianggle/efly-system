import request, { type ApiResponse, type ApiListRes } from '@/utils/request'

export function cms_link_category_list<T>(params = {}) {
  return request<ApiResponse<T>>({
    method: 'get',
    url: 'cms/listCmsLinkCategory',
    params,
  })
}
export function cms_link_category_remove<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/removeCmsLinkCategory',
    data,
  })
}
export function cms_link_category_add<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/addCmsLinkCategory',
    data,
  })
}
export function cms_link_category_modify<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/modifyCmsLinkCategory',
    data,
  })
}
export function cms_link_category_order<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/orderCmsLinkCategory',
    data,
  })
}

export function cms_link_list<T>(params = {}) {
  return request<ApiResponse<ApiListRes<T>>>({
    method: 'get',
    url: 'cms/listCmsLink',
    params,
  })
}
export function cms_link_add<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/addCmsLink',
    data,
  })
}
export function cms_link_modify<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/modifyCmsLink',
    data,
  })
}
export function cms_link_order<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/orderCmsLink',
    data,
  })
}
export function cms_link_updateStatus<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/updateCmsLinkStatus',
    data,
  })
}
export function cms_link_batchOperate<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'cms/batchOperateCmsLink',
    data,
  })
}
