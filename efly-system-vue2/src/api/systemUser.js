import request from '@/utils/request'

export function user_list(params) {
  return request({
    method: 'get',
    url: 'user/listUser',
    params
  })
}

export function user_remove(data) {
  return request({
    method: 'post',
    url: 'user/deleteUser',
    data
  })
}

export function user_add(data) {
  return request({
    method: 'post',
    url: 'user/addUser',
    data
  })
}

export function user_modify(data) {
  return request({
    method: 'post',
    url: 'user/modifyUser',
    data
  })
}

export function user_online_list(params) {
  return request({
    method: 'get',
    url: 'user/listOnlineUser',
    params
  })
}

export function user_online_remove(data) {
  return request({
    method: 'post',
    url: 'user/deleteOnlineUser',
    data
  })
}
