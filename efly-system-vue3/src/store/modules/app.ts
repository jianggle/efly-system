import { defineStore } from 'pinia'
import AppConfig from '@/config'
import { system_account_modifySetting } from '@/api/system'
import modal from '@/plugins/modal'
import useDynamicTitle from '@/hooks/useDynamicTitle'

async function handleModifySetting(params = {}, tips: string) {
  try {
    modal.loading(tips)
    await system_account_modifySetting(params)
    setTimeout(() => {
      modal.closeLoading()
      return Promise.resolve()
    }, 1000)
  } catch (error) {
    modal.closeLoading()
    return Promise.reject(error)
  }
}

const useAppStore = defineStore('app', {
  state: () => ({
    sidebar: {
      open: true
    },
    setting: {
      visible: false,
      title: '',
      size: AppConfig.setting.size,
      theme: AppConfig.setting.theme,
      navMode: AppConfig.setting.navMode,
      tagsView: AppConfig.setting.tagsView,
      fixedHeader: AppConfig.setting.fixedHeader,
      sidebarLogo: AppConfig.setting.sidebarLogo,
      dynamicTitle: AppConfig.setting.dynamicTitle,
    }
  }),
  actions: {
    toggleSidebar() {
      this.sidebar.open = !this.sidebar.open
    },
    updateTitle(title: string) {
      this.setting.title = title
      useDynamicTitle()
    },
    updateSetting(key: string, val: any) {
      const keys = Object.keys(this.$state.setting)
      if (keys.includes(key)) {
        this.setting[key] = val
      }
    },
    saveSetting() {
      const params = {}
      for (let item in this.$state.setting) {
        if (['visible', 'title'].includes(item)) continue
        params[item] = this.$state.setting[item]
      }
      handleModifySetting(params, '保存中...').then(() => {
        this.setting.visible = false
      })
    },
    resetSetting() {
      handleModifySetting({}, '重置中...').then(() => {
        for (const [key, val] of Object.entries(AppConfig.setting)) {
          this.updateSetting(key, val)
        }
        this.setting.visible = false
      })
    },
  },
})

export default useAppStore
