import store from '@/store'
import router from '@/router'

export default {
  // 关闭当前tab页
  close() {
    store.commit('sysTab/REMOVE_TAB', router.currentRoute)
  }
}
