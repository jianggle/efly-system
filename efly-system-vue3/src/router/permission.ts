import router from './index'
import useUserStore from '@/store/modules/user'
import useAppStore from '@/store/modules/app'
import { delaySomeTime } from '@/utils'
import { getToken } from '@/utils/auth'
import { ElLoading, ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (to.meta && to.meta.title) {
    useAppStore().updateTitle(String(to.meta.title))
  }
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (useUserStore().info.id) {
        next()
      } else {
        const loadingInstance = ElLoading.service({
          fullscreen: true,
          text: '系统载入中...',
        })
        try {
          await delaySomeTime(300)
          // 获取用户信息、可访问路由、权限等
          const accessRoutes = await useUserStore().getUserInfo()
          // 动态添加可访问路由
          accessRoutes.forEach((route) => {
            if (Array.isArray(route.children) && route.children.length) {
              route.children.forEach((item) => {
                router.addRoute('root', item)
              })
            } else {
              router.addRoute('root', route)
            }
          })
          // hack: 确保添加完成
          next({ ...to, replace: true })
        } catch (error) {
          console.log(error)
          await useUserStore().logout()
          ElMessage.error(String(error))
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
