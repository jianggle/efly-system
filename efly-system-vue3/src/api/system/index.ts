import request, { ApiResponse, ApiListRes } from '@/utils/request'

export function system_captcha<T>() {
  return request<ApiResponse<T>>({
    method: 'get',
    url: 'base/captchaImage',
  })
}

export function system_login(data = {}) {
  return request<ApiResponse<string>>({
    method: 'post',
    url: 'base/userLogin',
    data,
  })
}
export function system_logout<T>() {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'base/userLogout',
  })
}

export function system_account_permit<T>() {
  return request<ApiResponse<T>>({
    method: 'get',
    url: 'base/userPermit',
    headers: {
      // token失效时不显示提示弹窗，另作处理
      ignore401: 'yes',
    },
  })
}
export function system_account_info<T>() {
  return request<ApiResponse<T>>({
    method: 'get',
    url: 'base/userInfo',
  })
}
export function system_account_loginlog<T>(params = {}) {
  return request<ApiResponse<ApiListRes<T>>>({
    method: 'get',
    url: 'base/userLoginLog',
    params,
  })
}

export function system_account_modifyAvatar<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'base/modifyUserAvatar',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
export function system_account_modifyInfo<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'base/modifyUserInfo',
    data,
  })
}
export function system_account_modifyPwd<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'base/modifyUserPwd',
    data,
  })
}
export function system_account_modifySetting<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'base/modifyUserSetting',
    data,
  })
}

export function system_onlineuser_list<T>(params = {}) {
  return request<ApiResponse<ApiListRes<T>>>({
    method: 'get',
    url: 'user/listOnlineUser',
    params,
  })
}
export function system_onlineuser_remove<T>(data = {}) {
  return request<ApiResponse<T>>({
    method: 'post',
    url: 'user/deleteOnlineUser',
    data,
  })
}

export function system_loginlog_list<T>(params = {}) {
  return request<ApiResponse<ApiListRes<T>>>({
    method: 'get',
    url: 'log/listLoginLog',
    params,
  })
}
