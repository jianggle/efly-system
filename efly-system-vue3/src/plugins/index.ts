import { App } from 'vue'
import * as utils from '@/utils'
import tab from './tab'
import auth from './auth'
import modal from './modal'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $utils: typeof utils
    $tab: typeof tab
    $auth: typeof auth
    $modal: typeof modal
  }
}

export default function installPlugins(app: App) {
  app.config.globalProperties.$utils = utils
  app.config.globalProperties.$tab = tab
  app.config.globalProperties.$auth = auth
  app.config.globalProperties.$modal = modal
}
