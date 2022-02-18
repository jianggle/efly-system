import request from '@/utils/request'

export function login_log_list(params) {
  return request({
    method: 'get',
    url: 'log/listLoginLog',
    params
  })
}

export function login_log_reset() {
  return request({
    method: 'post',
    url: 'log/resetLoginLog'
  })
}
