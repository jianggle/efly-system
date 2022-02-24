import { user_login, user_logout, user_permission } from '@/api/system'
import { setToken, removeToken } from '@/utils/auth'
import { treeFilter } from '@/utils/treeTool'
import { isExternal } from '@/utils/validator'
import baseRoutes from '@/router/baseRoutes'
import Layout from '@/layout'
import ParentView from '@/components/ParentView'

const loadView = (view) => {
  return () => import(`@/views/${view}`)
}

const filterAsyncRouter = (asyncRouterMap) => {
  return asyncRouterMap.filter(item => {
    if (item.component) {
      if (item.component === 'Layout') {
        item.component = Layout
      } else if (item.component === 'ParentView') {
        item.component = ParentView
      } else {
        item.component = loadView(item.component)
      }
    }
    if (item.children && item.children.length) {
      item.redirect = 'no'
      item.children = filterAsyncRouter(item.children)
    }
    return true
  })
}

export default {
  namespaced: true,
  state: {
    showLogin: false,
    info: {
      id: '',
      account: '',
      name: '',
      avatar: '',
    },
    permissions: [],
    routes: [],
    sidebarMenu: []
  },
  mutations: {
    OPEN_LOGIN_FORM(state) {
      state.showLogin = true
    },
    CLOSE_LOGIN_FORM(state) {
      state.showLogin = false
    },
    UPDATE_USER_INFO(state, payload) {
      state.info = payload
    },
    UPDATE_USER_NAME(state, payload) {
      state.info.name = payload
    },
    UPDATE_USER_AVATAR(state, payload) {
      state.info.avatar = payload
    },
    UPDATE_USER_PERMISSION(state, payload) {
      state.permissions = payload
    },
    UPDATE_USER_ROUTE(state, payload) {
      state.routes = payload
    },
    UPDATE_SIDEBAR_MENU(state, payload) {
      state.sidebarMenu = payload
    },
  },
  actions: {
    async getUserInfo({ commit }) {
      const { data: { user, menus, permissions }} = await user_permission()
      commit('UPDATE_USER_INFO', {
        id: user.userId,
        account: user.userName,
        name: user.realName,
        avatar: user.avatar,
      })
      commit('UPDATE_USER_PERMISSION', permissions)
      const userMenus = filterAsyncRouter(menus)
      const fullMenus = [...baseRoutes, ...userMenus]
      commit('UPDATE_USER_ROUTE', fullMenus)
      commit('UPDATE_SIDEBAR_MENU', fullMenus)
      // 载入布局
      if (user.setting) {
        const settings = JSON.parse(user.setting)
        for (const [key, val] of Object.entries(settings)) {
          commit('sysLayout/UPDATE_LAYOUT', { key, val }, { root: true })
        }
      }
      // 返回路由
      const accessedRoutes = treeFilter(userMenus, (node) => !isExternal(node.path))
      return [
        ...accessedRoutes,
        { path: '*', redirect: '/404' }
      ]
    },
    async login({ commit }, params) {
      const res = await user_login(params)
      setToken(res.data)
    },
    async logout() {
      await user_logout()
      removeToken()
    },
    async frontendLogout() {
      removeToken()
    }
  }
}
