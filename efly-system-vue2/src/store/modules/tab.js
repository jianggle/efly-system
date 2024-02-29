/** 获取当前页面组件的name */
const getCptName = (route) => {
  const res = route.matched.find((item) => item.path === route.path)
  return res && res.components.default.name
}

export default {
  namespaced: true,
  state: {
    visitedTabs: [],
    cachedTabs: [],
  },
  mutations: {
    addKeepAliveName(state, name) {
      !state.cachedTabs.includes(name) && state.cachedTabs.push(name)
    },
    removeKeepAliveName(state, name) {
      state.cachedTabs = state.cachedTabs.filter((item) => item !== name)
    },
    setKeepAliveName(state, names = []) {
      state.cachedTabs = names
    },
    setVisitedTabs(state, tabs = []) {
      state.visitedTabs = tabs
    },
  },
  actions: {
    addVisitedTab({ commit, state }, route) {
      if (!route.meta || !route.meta.title) return
      if (state.visitedTabs.some((v) => v.path === route.fullPath)) return
      const cptName = getCptName(route)
      commit('setVisitedTabs', [
        ...state.visitedTabs,
        {
          path: route.fullPath,
          title: route.meta.title,
          name: cptName,
          affix: route.meta.affix === true,
        },
      ])
    },
    addCachedTab({ commit }, route) {
      const cptName = getCptName(route)
      if (!route.meta || route.meta.isCached !== true || !cptName) return
      commit('addKeepAliveName', cptName)
    },
    addTab({ dispatch }, tab) {
      dispatch('addVisitedTab', tab)
      dispatch('addCachedTab', tab)
    },
    removeTab({ commit, state }, data) {
      const isRouteData = Array.isArray(data.matched)
      const realPath = isRouteData ? data.fullPath : data.path
      for (const [i, v] of state.visitedTabs.entries()) {
        if (v.path === realPath) {
          state.visitedTabs.splice(i, 1)
          break
        }
      }
      const cptName = isRouteData ? getCptName(data) : data.name
      commit('removeKeepAliveName', cptName)
    },
    removeAllTab({ commit, state }) {
      return new Promise((resolve) => {
        const affixTabs = state.visitedTabs.filter((tab) => tab.affix)
        commit('setVisitedTabs', affixTabs)
        commit('setKeepAliveName')
        resolve()
      })
    },
    removeOtherTab({ commit, state }, route) {
      return new Promise((resolve) => {
        if (state.visitedTabs.length < 2) return resolve(false)
        const cptName = getCptName(route)
        commit(
          'setVisitedTabs',
          state.visitedTabs.filter((item) => item.affix || item.path === route.fullPath)
        )
        commit('setKeepAliveName', cptName && route.meta.isCached === true ? [cptName] : [])
        resolve(true)
      })
    },
    changeSort({ commit, state }, { newIndex, oldIndex }) {
      const tempList = JSON.parse(JSON.stringify(state.visitedTabs))
      const currRow = tempList.splice(oldIndex, 1)[0]
      tempList.splice(newIndex, 0, currRow)
      commit('setVisitedTabs', tempList)
    },
  },
}
