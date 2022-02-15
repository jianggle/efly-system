import request from '@/utils/request'

export function role_list(params) {
  return request({
    method: 'get',
    url: 'role/listRole',
    params
  })
}

export function role_simple_list(params) {
  return request({
    method: 'get',
    url: 'role/listSimpleRole',
    params
  })
}

export function role_remove(data) {
  return request({
    method: 'post',
    url: 'role/deleteRole',
    data
  })
}

export function role_add(data) {
  return request({
    method: 'post',
    url: 'role/addRole',
    data
  })
}

export function role_modify(data) {
  return request({
    method: 'post',
    url: 'role/modifyRole',
    data
  })
}
