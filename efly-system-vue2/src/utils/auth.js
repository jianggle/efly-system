import { tokenKey } from '@/config'

export function setToken(value) {
  window.localStorage.setItem(tokenKey, value)
}

export function getToken() {
  return window.localStorage.getItem(tokenKey)
}

export function removeToken() {
  window.localStorage.removeItem(tokenKey)
}
