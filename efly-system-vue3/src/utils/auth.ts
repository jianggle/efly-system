import AppConfig from '@/config'

export function setToken(value: string) {
  window.localStorage.setItem(AppConfig.tokenKey, value)
}

export function getToken() {
  return window.localStorage.getItem(AppConfig.tokenKey)
}

export function removeToken() {
  window.localStorage.removeItem(AppConfig.tokenKey)
}
