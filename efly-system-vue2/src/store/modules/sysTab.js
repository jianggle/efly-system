// 获取当前页面组件的name
const getCptName = (route) => {
  const res = route.matched.find(item => item.path === route.path)
  return res && res.components.default.name
}

const mutations = {
  ADD_OPENED_PAGES(state, tab) {
    if (!tab.meta || !tab.meta.title) return
    if (state.openedPages.some(v => v.path === tab.fullPath)) return
    const cptName = getCptName(tab)
    state.openedPages.push({
      path: tab.fullPath,
      title: tab.meta.title,
      name: cptName
    })
  },
  ADD_CACHED_PAGES(state, tab) {
    const cptName = getCptName(tab)
    if (!tab.meta || tab.meta.isCached !== true || !cptName) return
    if (state.cachedPages.includes(cptName)) return
    state.cachedPages.push(cptName)
  },
  REMOVE_TAB(state, data) {
    const isRouteData = Array.isArray(data.matched)
    const realPath = isRouteData ? data.fullPath : data.path
    for (const [i, v] of state.openedPages.entries()) {
      if (v.path === realPath) {
        state.openedPages.splice(i, 1)
        break
      }
    }
    const cptName = isRouteData ? getCptName(data) : data.name
    const index = state.cachedPages.indexOf(cptName)
    if (index < 0) return
    state.cachedPages.splice(index, 1)
  },
  REMOVE_ALL_CACHED_PAGES(state) {
    state.cachedPages = []
  },
  REMOVE_ALL_TAB(state) {
    state.openedPages = []
    state.cachedPages = []
  },
  REMOVE_OTHER_TAB(state, tab) {
    if (state.openedPages.length < 2) return
    const cptName = getCptName(tab)
    state.openedPages = state.openedPages.filter(item => item.path === tab.fullPath)
    state.cachedPages = (cptName && tab.meta.isCached === true) ? [cptName] : []
  }
}

const actions = {
  addTab({ commit }, tab) {
    commit('ADD_OPENED_PAGES', tab)
    commit('ADD_CACHED_PAGES', tab)
  }
}

export default {
  namespaced: true,
  state: {
    openedPages: [],
    cachedPages: [],
  },
  mutations,
  actions,
}
