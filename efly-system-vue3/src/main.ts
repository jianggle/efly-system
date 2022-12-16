import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './router/permission'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 引入全局样式
import './assets/style/index.scss'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from './icons/SvgIcon.vue'
//
import TableCard from './components/TableCard.vue'
import Pagination from './components/Pagination.vue'

import AppConfig from './config'
import plugins from './plugins'

const app = createApp(App)

// 注册全局组件
app.component('SvgIcon', SvgIcon)
app.component('TableCard', TableCard)
app.component('Pagination', Pagination)

app.use(plugins)
app.use(store)
app.use(router)
app.use(ElementPlus, {
  locale: zhCn,
  size: AppConfig.setting.size,
})

app.mount('#app')
