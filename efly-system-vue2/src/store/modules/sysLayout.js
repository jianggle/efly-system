import { layoutSettings } from '@/config'
import { user_modify_setting } from '@/api/systemBase'
import { Loading } from 'element-ui'

async function handleModifySetting(params, tips) {
  const loading = Loading.service({
    lock: true,
    text: tips,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  try {
    await user_modify_setting(params)
    setTimeout(() => {
      loading.close()
      return Promise.resolve()
    }, 1000)
  } catch (error) {
    loading.close()
    return Promise.reject(error)
  }
}

export default {
  namespaced: true,
  state: {
    visible: false,
    theme: layoutSettings.theme,
    size: layoutSettings.size,
    navMode: layoutSettings.navMode,
    tagsView: layoutSettings.tagsView,
    fixedHeader: layoutSettings.fixedHeader,
    sidebarLogo: layoutSettings.sidebarLogo,
    dynamicTitle: layoutSettings.dynamicTitle,
    title: '',
  },
  mutations: {
    UPDATE_LAYOUT(state, { key, val }) {
      if (Object.keys(state).includes(key)) {
        state[key] = val
      }
    },
    UPDATE_TITLE(state, payload) {
      state.title = payload
    }
  },
  actions: {
    saveLayout({ commit, state }) {
      const params = { ...state }
      delete params.visible
      delete params.title
      handleModifySetting(params, '保存中...').then(() => {
        commit('UPDATE_LAYOUT', { key: 'visible', val: false })
      })
    },
    resetLayout({ commit }) {
      handleModifySetting({}, '重置中...').then(() => {
        for (const [key, val] of Object.entries(layoutSettings)) {
          commit('UPDATE_LAYOUT', { key, val })
        }
        commit('UPDATE_LAYOUT', { key: 'visible', val: false })
      })
    }
  }
}
