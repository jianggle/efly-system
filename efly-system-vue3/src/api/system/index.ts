import request, { ApiResponse, ApiListRes } from '@/utils/request'

/**
 * 系统相关接口
 */
class SystemService {
  static getCaptcha<T>() {
    return request<ApiResponse<T>>({
      method: 'get',
      url: 'base/captchaImage',
    })
  }

  static login(data = {}) {
    return request<ApiResponse<string>>({
      method: 'post',
      url: 'base/userLogin',
      data,
    })
  }
  static logout<T>() {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'base/userLogout',
    })
  }

  static getAccountPermit<T>() {
    return request<ApiResponse<T>>({
      method: 'get',
      url: 'base/userPermit',
      headers: {
        // token失效时不显示提示弹窗，另作处理
        ignore401: true,
      },
    })
  }
  static getAccountInfo<T>() {
    return request<ApiResponse<T>>({
      method: 'get',
      url: 'base/userInfo',
    })
  }
  static getAccountLoginLog<T>(params = {}) {
    return request<ApiResponse<ApiListRes<T>>>({
      method: 'get',
      url: 'base/userLoginLog',
      params,
    })
  }

  static modifyAccountAvatar<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'base/modifyUserAvatar',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
  static modifyAccountInfo<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'base/modifyUserInfo',
      data,
    })
  }
  static modifyAccountPwd<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'base/modifyUserPwd',
      data,
    })
  }
  static modifyAccountSetting<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'base/modifyUserSetting',
      data,
    })
  }

  static getOnlineUser<T>(params = {}) {
    return request<ApiResponse<ApiListRes<T>>>({
      method: 'get',
      url: 'user/listOnlineUser',
      params,
    })
  }
  static removeOnlineUser<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'user/deleteOnlineUser',
      data,
    })
  }

  static getLoginLog<T>(params = {}) {
    return request<ApiResponse<ApiListRes<T>>>({
      method: 'get',
      url: 'log/listLoginLog',
      params,
    })
  }
}

export default SystemService
