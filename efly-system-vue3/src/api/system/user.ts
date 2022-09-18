import request from '@/utils/request'

/**
 * 系统用户相关接口
 */
class SystemUserService {
  static list(params: any) {
    return request({
      method: 'get',
      url: 'user/listUser',
      params,
    })
  }
  static remove(data: any) {
    return request({
      method: 'post',
      url: 'user/deleteUser',
      data,
    })
  }
  static add(data: any) {
    return request({
      method: 'post',
      url: 'user/addUser',
      data,
    })
  }
  static modify(data: any) {
    return request({
      method: 'post',
      url: 'user/modifyUser',
      data,
    })
  }
}

export default SystemUserService
