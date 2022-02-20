import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { layoutSettings } from '@/config'

import VueMeta from 'vue-meta'
import './icons'
import * as utils from './utils'
import plugins from './plugins'

import './assets/style/index.scss'

import Element from 'element-ui'
// 使用cdn时请注释掉，避免被打包
import 'element-ui/lib/theme-chalk/index.css'

import Pagination from './components/Pagination'

// element-ui配置
Element.MessageBox.setDefaults({
  showClose: false,
  closeOnClickModal: false,
  closeOnPressEscape: false,
})
Object.assign(Element.Dialog.props, {
  closeOnClickModal: {
    type: Boolean,
    default: false
  },
  closeOnPressEscape: {
    type: Boolean,
    default: false
  },
})

// 全局方法挂载
Vue.prototype.$utils = utils

// 全局组件注册
Vue.component('Pagination', Pagination)

Vue.use(plugins)
Vue.use(VueMeta)
Vue.use(Element, {
  size: layoutSettings.size
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
