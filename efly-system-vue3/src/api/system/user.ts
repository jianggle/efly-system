import request, { type ApiResponse, type ApiListRes } from '@/utils/request'

export function system_user_list<T>(params = {}) {
  return request<ApiResponse<ApiListRes<T>>>({
    method: 'get',
    url: 'user/listUser',
    params,
  })
}

export function system_user_remove<T>(data: { userId: number }) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'user/deleteUser',
    data,
  })
}

export function system_user_add<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'user/addUser',
    data,
  })
}

export function system_user_modify<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'user/modifyUser',
    data,
  })
}
