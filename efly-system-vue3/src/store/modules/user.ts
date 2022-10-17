import { defineStore } from 'pinia'
import { setToken, removeToken } from '@/utils/auth'
import { treeFilter } from '@/utils/treeTool'
import { isExternal } from '@/utils/validator'
import SystemService from '@/api/system'
import baseRoutes from '@/router/baseRoutes'
import Layout from '@/layout/index.vue'
import ParentView from '@/components/ParentView.vue'
import useAppStore from '@/store/modules/app'

const allViews = import.meta.glob('../../views/*/*.vue')

const filterAsyncRouter = (asyncRouterMap: any[]) => {
  return asyncRouterMap.filter((item) => {
    if (item.component) {
      if (item.component === 'Layout') {
        item.component = Layout
      } else if (item.component === 'ParentView') {
        item.component = ParentView
      } else {
        const fixPath = /\.vue$/.test(item.component) ? item.component : item.component + '.vue'
        item.component = allViews[`../../views/${fixPath}`]
      }
    }
    if (item.children && item.children.length) {
      item.redirect = 'no'
      item.children = filterAsyncRouter(item.children)
    }
    return true
  })
}

function generateFlatRoutes(routes: any[]) {
  const flatRoutes = []
  for (const item of routes) {
    let childrenFlatRoutes: any[] = []
    if (Array.isArray(item.children) && item.children.length) {
      childrenFlatRoutes = castToFlatRoute(item.children)
    }
    flatRoutes.push({
      name: item.name,
      path: item.path,
      component: item.component,
      redirect: item.redirect,
      children: childrenFlatRoutes,
    })
  }
  return flatRoutes
}

function castToFlatRoute(routes: any[], flatRoutes: any[] = []) {
  for (const item of routes) {
    if (Array.isArray(item.children) && item.children.length) {
      if (item.redirect && item.redirect !== 'no') {
        flatRoutes.push({
          name: item.name,
          path: item.path,
          meta: item.meta,
          redirect: item.redirect,
        })
      }
      castToFlatRoute(item.children, flatRoutes)
    } else {
      flatRoutes.push({
        name: item.name,
        path: item.path,
        meta: item.meta,
        component: item.component,
      })
    }
  }
  return flatRoutes
}

const useUserStore = defineStore('user', {
  state: () => ({
    showLogin: false,
    info: {
      id: '',
      account: '',
      name: '',
      avatar: '',
    },
    permissions: [],
    routes: [],
    sidebarMenu: [],
  }),
  getters: {
    allVisibleMenu(state): any[] {
      return state.routes.filter((item: any) => item.meta && item.meta.title && item.meta.isMenu)
    },
    sidebarVisibleMenu(state): any[] {
      return (state.sidebarMenu || []).filter((item: any) => item.meta && item.meta.title && item.meta.isMenu)
    }
  },
  actions: {
    toggleLoginDialog(val: boolean) {
      this.showLogin = val
    },
    updateUserInfo(payload: any) {
      this.info = payload
    },
    updateUserName(payload: string) {
      this.info.name = payload
    },
    updateUserAvatar(payload: string) {
      this.info.avatar = payload
    },
    updateUserPermission(payload: any) {
      this.permissions = payload
    },
    updateUserRoute(payload: any) {
      this.routes = payload
    },
    updateSidebarMenu(payload: any) {
      this.sidebarMenu = payload
    },
    async getUserInfo() {
      const { data } = await SystemService.getAccountPermit<any>()
      this.updateUserInfo({
        id: data.user.userId,
        account: data.user.userName,
        name: data.user.realName,
        avatar: data.user.avatar,
      })
      this.updateUserPermission(data.permissions)
      const userMenus = filterAsyncRouter(data.menus)
      const fullMenus = [...baseRoutes, ...userMenus]
      this.updateUserRoute(fullMenus)
      this.updateSidebarMenu(fullMenus)
      // 载入布局
      if (data.user.setting) {
        const settings = JSON.parse(data.user.setting)
        for (const [key, val] of Object.entries(settings)) {
          useAppStore().updateSetting(key, val)
        }
      }
      // 过滤掉外链等特殊项
      const validRoutes = treeFilter(userMenus, (node: any) => !isExternal(node.path))
      // vue-router无法缓存超过两级的路由，拍扁成两级再添加
      const accessRoutes = generateFlatRoutes(validRoutes)
      return accessRoutes
    },
    async login(params: any) {
      const res = await SystemService.login(params)
      setToken(res.data)
    },
    async logout() {
      await SystemService.logout()
      removeToken()
    },
    async frontendLogout() {
      removeToken()
    },
  },
})

export default useUserStore
