import request, { ApiResponse, ApiListRes } from '@/utils/request'

/**
 * 系统用户相关接口
 */
class SystemUserService {
  static list<T>(params = {}) {
    return request<ApiResponse<ApiListRes<T>>>({
      method: 'get',
      url: 'user/listUser',
      params,
    })
  }
  static remove<T>(data: { userId: number }) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'user/deleteUser',
      data,
    })
  }
  static add<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'user/addUser',
      data,
    })
  }
  static modify<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'user/modifyUser',
      data,
    })
  }
}

export default SystemUserService
