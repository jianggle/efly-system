import request, { ApiResponse } from '@/utils/request'

export function system_role_list<T>(params = {}) {
  return request<ApiResponse<T>>({
    method: 'get',
    url: 'role/listRole',
    params,
  })
}

export function system_role_simple_list<T>(params = {}) {
  return request<ApiResponse<T>>({
    method: 'get',
    url: 'role/listSimpleRole',
    params,
  })
}

export function system_role_remove<T>(data: { roleId: number }) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'role/deleteRole',
    data,
  })
}

export function system_role_add<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'role/addRole',
    data,
  })
}

export function system_role_modify<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'role/modifyRole',
    data,
  })
}
