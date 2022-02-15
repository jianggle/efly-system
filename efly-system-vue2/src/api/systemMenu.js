import request from '@/utils/request'

export function menu_list(params) {
  return request({
    method: 'get',
    url: 'menu/listMenu',
    params
  })
}

export function menu_simple_list(params) {
  return request({
    method: 'get',
    url: 'menu/listSimpleMenu',
    params
  })
}

export function menu_remove(data) {
  return request({
    method: 'post',
    url: 'menu/deleteMenu',
    data
  })
}

export function menu_add(data) {
  return request({
    method: 'post',
    url: 'menu/addMenu',
    data
  })
}

export function menu_modify(data) {
  return request({
    method: 'post',
    url: 'menu/modifyMenu',
    data
  })
}

export function menu_modify_order(data) {
  return request({
    method: 'post',
    url: 'menu/modifyMenuOrder',
    data
  })
}
