import request from '@/utils/request'

export function common_captcha() {
  return request({
    method: 'get',
    url: 'base/captchaImage'
  })
}

export function user_login(data) {
  return request({
    method: 'post',
    url: 'base/userLogin',
    data
  })
}

export function user_logout() {
  return request({
    method: 'post',
    url: 'base/userLogout'
  })
}

export function user_permission() {
  return request({
    method: 'get',
    url: 'base/userPermit',
    headers: {
      // token失效时不显示提示弹窗，另作处理
      ignore401: true
    }
  })
}

export function user_info() {
  return request({
    method: 'get',
    url: 'base/userInfo'
  })
}

export function user_modify_avatar(data) {
  return request({
    method: 'post',
    url: 'base/modifyUserAvatar',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function user_modify_info(data) {
  return request({
    method: 'post',
    url: 'base/modifyUserInfo',
    data
  })
}

export function user_modify_pwd(data) {
  return request({
    method: 'post',
    url: 'base/modifyUserPwd',
    data
  })
}

export function user_modify_setting(data) {
  return request({
    method: 'post',
    url: 'base/modifyUserSetting',
    data
  })
}
