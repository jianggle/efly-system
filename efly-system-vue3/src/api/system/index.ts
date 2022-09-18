import request from '@/utils/request'

/**
 * 系统相关接口
 */
class SystemService {
  static getCaptcha() {
    return request({
      method: 'get',
      url: 'base/captchaImage',
    })
  }

  static login(data: any) {
    return request({
      method: 'post',
      url: 'base/userLogin',
      data,
    })
  }
  static logout() {
    return request({
      method: 'post',
      url: 'base/userLogout',
    })
  }

  static getAccountPermit() {
    return request({
      method: 'get',
      url: 'base/userPermit',
      headers: {
        // token失效时不显示提示弹窗，另作处理
        ignore401: true,
      },
    })
  }
  static getAccountInfo() {
    return request({
      method: 'get',
      url: 'base/userInfo',
    })
  }
  static getAccountLoginLog(params: any) {
    return request({
      method: 'get',
      url: 'base/userLoginLog',
      params,
    })
  }

  static modifyAccountAvatar(data: any) {
    return request({
      method: 'post',
      url: 'base/modifyUserAvatar',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
  static modifyAccountInfo(data: any) {
    return request({
      method: 'post',
      url: 'base/modifyUserInfo',
      data,
    })
  }
  static modifyAccountPwd(data: any) {
    return request({
      method: 'post',
      url: 'base/modifyUserPwd',
      data,
    })
  }
  static modifyAccountSetting(data: any) {
    return request({
      method: 'post',
      url: 'base/modifyUserSetting',
      data,
    })
  }

  static getOnlineUser(params: any) {
    return request({
      method: 'get',
      url: 'user/listOnlineUser',
      params,
    })
  }
  static removeOnlineUser(data: any) {
    return request({
      method: 'post',
      url: 'user/deleteOnlineUser',
      data,
    })
  }

  static getLoginLog(params: any) {
    return request({
      method: 'get',
      url: 'log/listLoginLog',
      params,
    })
  }
}

export default SystemService
