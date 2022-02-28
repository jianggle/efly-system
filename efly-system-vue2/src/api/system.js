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

export function user_login_log(params) {
  return request({
    method: 'get',
    url: 'base/userLoginLog',
    params
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

export function menu_list(params) {
  return request({
    method: 'get',
    url: 'menu/listMenu',
    params
  })
}
export function menu_simple_list(params) {
  return request({
    method: 'get',
    url: 'menu/listSimpleMenu',
    params
  })
}
export function menu_remove(data) {
  return request({
    method: 'post',
    url: 'menu/deleteMenu',
    data
  })
}
export function menu_add(data) {
  return request({
    method: 'post',
    url: 'menu/addMenu',
    data
  })
}
export function menu_modify(data) {
  return request({
    method: 'post',
    url: 'menu/modifyMenu',
    data
  })
}
export function menu_modify_order(data) {
  return request({
    method: 'post',
    url: 'menu/modifyMenuOrder',
    data
  })
}

export function role_list(params) {
  return request({
    method: 'get',
    url: 'role/listRole',
    params
  })
}
export function role_simple_list(params) {
  return request({
    method: 'get',
    url: 'role/listSimpleRole',
    params
  })
}
export function role_remove(data) {
  return request({
    method: 'post',
    url: 'role/deleteRole',
    data
  })
}
export function role_add(data) {
  return request({
    method: 'post',
    url: 'role/addRole',
    data
  })
}
export function role_modify(data) {
  return request({
    method: 'post',
    url: 'role/modifyRole',
    data
  })
}

export function user_list(params) {
  return request({
    method: 'get',
    url: 'user/listUser',
    params
  })
}
export function user_remove(data) {
  return request({
    method: 'post',
    url: 'user/deleteUser',
    data
  })
}
export function user_add(data) {
  return request({
    method: 'post',
    url: 'user/addUser',
    data
  })
}
export function user_modify(data) {
  return request({
    method: 'post',
    url: 'user/modifyUser',
    data
  })
}

export function user_online_list(params) {
  return request({
    method: 'get',
    url: 'user/listOnlineUser',
    params
  })
}
export function user_online_remove(data) {
  return request({
    method: 'post',
    url: 'user/deleteOnlineUser',
    data
  })
}

export function login_log_list(params) {
  return request({
    method: 'get',
    url: 'log/listLoginLog',
    params
  })
}
