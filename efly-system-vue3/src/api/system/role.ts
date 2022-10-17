import request, { ApiResponse } from '@/utils/request'

/**
 * 系统角色相关接口
 */
class SystemRoleService {
  static list<T>(params = {}) {
    return request<ApiResponse<T>>({
      method: 'get',
      url: 'role/listRole',
      params,
    })
  }
  static listSimple<T>(params = {}) {
    return request<ApiResponse<T>>({
      method: 'get',
      url: 'role/listSimpleRole',
      params,
    })
  }
  static remove<T>(data: { roleId: number }) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'role/deleteRole',
      data,
    })
  }
  static add<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'role/addRole',
      data,
    })
  }
  static modify<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'role/modifyRole',
      data,
    })
  }
}

export default SystemRoleService
