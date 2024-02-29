import { user_login, user_logout, user_permission } from '@/api/system'
import { setToken, removeToken } from '@/utils/auth'
import { treeFilter } from '@/utils/treeTool'
import { isExternal } from '@/utils/validator'
import { constantRoutes } from '@/router'
import ParentView from '@/components/ParentView'

const Layout = () => import('@/layout/index.vue')

const loadView = (view) => {
  return () => import(`@/views/${view}`)
}

const filterAsyncRouter = (asyncRouterMap) => {
  return asyncRouterMap.filter((item) => {
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

function generateFlatRoutes(routes) {
  const flatRoutes = []
  for (const item of routes) {
    let childrenFlatRoutes = []
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

function castToFlatRoute(routes, flatRoutes = []) {
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
    sidebarMenu: [],
  },
  mutations: {
    toggleLoginDialog(state, payload) {
      state.showLogin = payload
    },
    updateUserInfo(state, payload) {
      state.info = payload
    },
    updateUserName(state, payload) {
      state.info.name = payload
    },
    updateUserAvatar(state, payload) {
      state.info.avatar = payload
    },
    updateUserPermission(state, payload) {
      state.permissions = payload
    },
    updateUserRoute(state, payload) {
      state.routes = payload
    },
    updateSidebarMenu(state, payload) {
      state.sidebarMenu = payload
    },
  },
  actions: {
    async getUserInfo({ commit }) {
      const { data } = await user_permission()
      commit('updateUserInfo', {
        id: data.user.userId,
        account: data.user.userName,
        name: data.user.realName,
        avatar: data.user.avatar,
      })
      commit('updateUserPermission', data.permissions)
      const userMenus = filterAsyncRouter(data.menus)
      const fullMenus = [...constantRoutes, ...userMenus]
      commit('updateUserRoute', fullMenus)
      commit('updateSidebarMenu', fullMenus)
      // 载入布局
      if (data.user.setting) {
        const settings = JSON.parse(data.user.setting)
        for (const [key, val] of Object.entries(settings)) {
          commit('app/updateSetting', { key, val }, { root: true })
        }
      }
      // 过滤掉外链等特殊项
      const validRoutes = treeFilter(userMenus, (node) => !isExternal(node.path))
      // vue-router无法缓存超过两级的路由，拍扁成两级再添加
      const accessRoutes = generateFlatRoutes(validRoutes)
      accessRoutes.push({ path: '*', redirect: '/404' })
      return accessRoutes
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
    },
  },
}
