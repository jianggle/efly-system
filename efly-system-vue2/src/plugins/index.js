// import tab from './tab'
import auth from './auth'

export default {
  install(Vue) {
    // Vue.prototype.$tab = tab
    Vue.prototype.$auth = auth
  }
}
