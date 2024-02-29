import router from './index'
import store from '@/store'
import { delaySomeTime } from '@/utils'
import { getToken } from '@/utils/auth'
import { Loading, Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  store.commit('app/updateTitle', to.meta && to.meta.title)
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      // 某些情况下`router.afterEach`不会被触发
      // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
      NProgress.done()
    } else {
      if (store.getters.userName) {
        next()
      } else {
        const loadingInstance = Loading.service({
          fullscreen: true,
          text: '系统载入中...',
        })
        try {
          await delaySomeTime(300)
          // 获取用户信息、可访问路由、权限等
          const accessRoutes = await store.dispatch('user/getUserInfo')
          // 动态添加可访问路由
          accessRoutes.forEach((route) => {
            router.addRoute(route)
          })
          // hack: 确保添加完成
          next({ ...to, replace: true })
        } catch (error) {
          console.error(error)
          await store.dispatch('user/logout')
          Message.error(error)
          next(`/login?backUrl=${to.path}`)
          NProgress.done()
        } finally {
          loadingInstance.close()
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next(`/login?backUrl=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
