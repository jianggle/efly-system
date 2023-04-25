import axios, { type AxiosRequestConfig } from 'axios'
import AppConfig from '@/config'
import modal from '@/plugins/modal'
import { getToken } from '@/utils/auth'
import useUserStore from '@/store/modules/user'

// https://github.com/axios/axios
const instance = axios.create({
  baseURL: AppConfig.apiBaseURL,
})

instance.interceptors.request.use(function (config) {
  const token = getToken()
  if (token) {
    config.headers!['Authorization'] = token
  }
  // 是否需要防止数据重复提交，不需要的接口可在其headers中设置repeatSubmit为true
  const isNeedRepeat = (config.headers || {}).repeatSubmit === true
  if (!isNeedRepeat && config.method === 'post') {
    const reqObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    let lastApiItem: any = sessionStorage.getItem('lastApiItem')
    lastApiItem = lastApiItem ? JSON.parse(lastApiItem) : null
    if (!lastApiItem) {
      sessionStorage.setItem('lastApiItem', JSON.stringify(reqObj))
    } else {
      const { data, time, url } = lastApiItem
      if (data === reqObj.data && reqObj.time - time < 1000 && url === reqObj.url) {
        const errMsg = '数据正在处理，请勿重复提交'
        console.warn(`[${url}]: ` + errMsg)
        return Promise.reject(new Error(errMsg))
      } else {
        sessionStorage.setItem('lastApiItem', JSON.stringify(reqObj))
      }
    }
  }
  return config
}, function (error) {
  console.error(error)
  return Promise.reject(error)
})

instance.interceptors.response.use(function (response) {
  const { code } = response.data
  if (code === 0) {
    return response.data
  } else if (code === 401) {
    const tipMsg = '无效的会话或会话已过期，请重新登录'
    if (response.config.headers?.ignore401 !== 'yes') {
      modal.msgError(tipMsg)
      useUserStore().toggleLoginDialog(true)
    }
    return Promise.reject(tipMsg)
  } else {
    const tipMsg = response.data.msg || '接口返回异常'
    modal.alertError(tipMsg)
    return Promise.reject(tipMsg)
  }
}, function (error) {
  console.error(error)
  const errMsg = error.message.toLowerCase();
  let tipMsg = ''
  if (errMsg === 'network error') {
    tipMsg = '接口连接异常'
  } else if (errMsg.includes('timeout')) {
    tipMsg = '接口请求超时'
  } else if (errMsg.includes('request failed with status code')) {
    tipMsg = '接口状态码' + errMsg.substr(errMsg.length - 3) + '异常'
  } else {
    tipMsg = errMsg
  }
  modal.msgError(tipMsg)
  return Promise.reject(tipMsg)
})

const service = <T>({
  url,
  method = 'get',
  params,
  data,
  headers,
}: AxiosRequestConfig) => {
  return instance.request<unknown, T>({
    url,
    method,
    params,
    data,
    headers,
  })
}

export default service

export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

export interface ApiListRes<T = any> {
  count: number
  rows: T[]
}
