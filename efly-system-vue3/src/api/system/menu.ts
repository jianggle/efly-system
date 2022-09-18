import request from '@/utils/request'

/**
 * 系统菜单相关接口
 */
class SystemMenuService {
  static list(params: any) {
    return request({
      method: 'get',
      url: 'menu/listMenu',
      params,
    })
  }
  static listSimple(params: any) {
    return request({
      method: 'get',
      url: 'menu/listSimpleMenu',
      params,
    })
  }
  static remove(data: any) {
    return request({
      method: 'post',
      url: 'menu/deleteMenu',
      data,
    })
  }
  static add(data: any) {
    return request({
      method: 'post',
      url: 'menu/addMenu',
      data,
    })
  }
  static modify(data: any) {
    return request({
      method: 'post',
      url: 'menu/modifyMenu',
      data,
    })
  }
  static order(data: any) {
    return request({
      method: 'post',
      url: 'menu/modifyMenuOrder',
      data,
    })
  }
}

export default SystemMenuService
