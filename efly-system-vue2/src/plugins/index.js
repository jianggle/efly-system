import tab from './tab'
import auth from './auth'
import modal from './modal'

export default {
  install(Vue) {
    Vue.prototype.$tab = tab
    Vue.prototype.$auth = auth
    Vue.prototype.$modal = modal
  }
}
