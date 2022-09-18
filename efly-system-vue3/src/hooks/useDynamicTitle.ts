import AppConfig from '@/config'
import useAppStore from '@/store/modules/app'

export default function () {
  const appStore = useAppStore()
  if (appStore.setting.dynamicTitle) {
    document.title = appStore.setting.title + ' - ' + AppConfig.siteName
  } else {
    document.title = AppConfig.siteName
  }
}
