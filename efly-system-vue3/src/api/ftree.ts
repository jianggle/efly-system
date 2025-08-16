import request from '@/utils/request'

export function list_ftree(params = {}) {
  return request({
    method: 'get',
    url: 'ftree/listFtTree',
    params,
  })
}

export function remove_ftree(data = {}) {
  return request({
    method: 'post',
    url: 'ftree/removeFtTree',
    data,
  })
}

export function add_ftree(data = {}) {
  return request({
    method: 'post',
    url: 'ftree/addFtTree',
    data,
  })
}

export function modify_ftree(data = {}) {
  return request({
    method: 'post',
    url: 'ftree/modifyFtTree',
    data,
  })
}
