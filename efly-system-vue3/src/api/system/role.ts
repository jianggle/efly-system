import request from '@/utils/request'

/**
 * 系统角色相关接口
 */
class SystemRoleService {
  static list(params: any) {
    return request({
      method: 'get',
      url: 'role/listRole',
      params,
    })
  }
  static listSimple(params: any) {
    return request({
      method: 'get',
      url: 'role/listSimpleRole',
      params,
    })
  }
  static remove(data: any) {
    return request({
      method: 'post',
      url: 'role/deleteRole',
      data,
    })
  }
  static add(data: any) {
    return request({
      method: 'post',
      url: 'role/addRole',
      data,
    })
  }
  static modify(data: any) {
    return request({
      method: 'post',
      url: 'role/modifyRole',
      data,
    })
  }
}

export default SystemRoleService
