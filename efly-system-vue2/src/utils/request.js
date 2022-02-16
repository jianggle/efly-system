import axios from 'axios'
import store from '@/store'
import appConfig from '../config'
import { MessageBox, Message } from 'element-ui'
import { getToken } from '@/utils/auth'

// https://github.com/axios/axios
const instance = axios.create({
  baseURL: appConfig.apiBaseURL,
})

instance.interceptors.request.use(function(config) {
  const token = getToken()
  if (token) {
    config.headers['Authorization'] = token
  }
  // 是否需要防止数据重复提交，不需要的接口可在其headers中设置repeatSubmit为true
  const isNeedRepeat = (config.headers || {}).repeatSubmit === true
  if (!isNeedRepeat && config.method === 'post') {
    const reqObj = {
      url: config.url,
      data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
      time: new Date().getTime()
    }
    let lastApiItem = sessionStorage.getItem('lastApiItem')
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
}, function(error) {
  console.log(error)
  return Promise.reject(error)
})

instance.interceptors.response.use(function(response) {
  const { code } = response.data
  if (code === 0) {
    return response.data
  } else if (code === 401) {
    const tipMsg = '无效的会话或会话已过期，请重新登录'
    if (response.config.headers.ignore401 !== true) {
      Message.error(tipMsg)
      store.commit('user/OPEN_LOGIN_FORM')
    }
    return Promise.reject(tipMsg)
  } else {
    const tipMsg = response.data.msg || '接口返回异常'
    MessageBox.alert(tipMsg, '温馨提示', { type: 'error' })
    return Promise.reject(tipMsg)
  }
}, function(error) {
  console.log(error)
  const errMsg = error.message.toLowerCase(); let tipMsg = ''
  if (errMsg === 'network error') {
    tipMsg = '接口连接异常'
  } else if (errMsg.includes('timeout')) {
    tipMsg = '接口请求超时'
  } else if (errMsg.includes('request failed with status code')) {
    tipMsg = '接口状态码' + errMsg.substr(errMsg.length - 3) + '异常'
  } else {
    tipMsg = errMsg
  }
  Message({
    message: tipMsg,
    type: 'error',
    duration: 5000
  })
  return Promise.reject(tipMsg)
})

export default instance
