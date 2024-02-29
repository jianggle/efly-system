import { layoutSettings } from '@/config'
import { user_modify_setting } from '@/api/system'
import modal from '@/plugins/modal'

async function handleModifySetting(params, tips) {
  try {
    modal.loading(tips)
    await user_modify_setting(params)
    setTimeout(() => {
      modal.closeLoading()
      return Promise.resolve()
    }, 1000)
  } catch (error) {
    modal.closeLoading()
    return Promise.reject(error)
  }
}

export default {
  namespaced: true,
  state: {
    device: 'desktop', // desktop mobile
    title: '',
    maximize: false, // 当前页面是否最大化
    sidebar: {
      opened: true,
    },
    settingPanelVisible: false,
    setting: {
      size: layoutSettings.size,
      theme: layoutSettings.theme,
      navMode: layoutSettings.navMode,
      tagsView: layoutSettings.tagsView,
      fixedHeader: layoutSettings.fixedHeader,
      sidebarLogo: layoutSettings.sidebarLogo,
      dynamicTitle: layoutSettings.dynamicTitle,
    },
  },
  mutations: {
    updateDevice(state, payload) {
      state.device = payload
    },
    updateTitle(state, payload) {
      state.title = payload
    },
    toggleMaximize(state, payload) {
      state.maximize = payload
    },
    toggleSidebar(state) {
      state.sidebar.opened = !state.sidebar.opened
    },
    closeSidebar(state) {
      state.sidebar.opened = false
    },
    openSidebar(state) {
      state.sidebar.opened = true
    },
    updateSettingPanelVisible(state, payload) {
      state.settingPanelVisible = payload
    },
    updateSetting(state, { key, val }) {
      const keys = Object.keys(state.setting)
      if (keys.includes(key)) {
        state.setting[key] = val
      }
    },
  },
  actions: {
    saveSetting({ commit, state }) {
      const params = {}
      for (const item in state.setting) {
        params[item] = state.setting[item]
      }
      handleModifySetting(params, '保存中...').then(() => {
        commit('updateSettingPanelVisible', false)
      })
    },
    resetSetting({ commit }) {
      handleModifySetting({}, '重置中...').then(() => {
        for (const [key, val] of Object.entries(layoutSettings)) {
          commit('updateSetting', { key, val })
        }
        commit('updateSettingPanelVisible', false)
      })
    },
  },
}
