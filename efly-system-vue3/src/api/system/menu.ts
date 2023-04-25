import request, { type ApiResponse } from '@/utils/request'

export function system_menu_list<T>(params = {}) {
  return request<ApiResponse<T>>({
    method: 'get',
    url: 'menu/listMenu',
    params,
  })
}

export function system_menu_simple_list<T>(params = {}) {
  return request<ApiResponse<T>>({
    method: 'get',
    url: 'menu/listSimpleMenu',
    params,
  })
}

export function system_menu_remove<T>(data: { menuId: number }) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'menu/deleteMenu',
    data,
  })
}

export function system_menu_add<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'menu/addMenu',
    data,
  })
}

export function system_menu_modify<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'menu/modifyMenu',
    data,
  })
}

export function system_menu_order<T>(data: {
  menuId: number
  orderNum: number
}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'menu/modifyMenuOrder',
    data,
  })
}
