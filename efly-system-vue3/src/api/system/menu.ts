import request, { ApiResponse } from '@/utils/request'

/**
 * 系统菜单相关接口
 */
class SystemMenuService {
  static list<T>(params = {}) {
    return request<ApiResponse<T>>({
      method: 'get',
      url: 'menu/listMenu',
      params,
    })
  }
  static listSimple<T>(params = {}) {
    return request<ApiResponse<T>>({
      method: 'get',
      url: 'menu/listSimpleMenu',
      params,
    })
  }
  static remove<T>(data: { menuId: number }) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'menu/deleteMenu',
      data,
    })
  }
  static add<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'menu/addMenu',
      data,
    })
  }
  static modify<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'menu/modifyMenu',
      data,
    })
  }
  static order<T>(data: { menuId: number; orderNum: number }) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'menu/modifyMenuOrder',
      data,
    })
  }
}

export default SystemMenuService
