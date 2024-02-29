import store from '@/store'
import router from '@/router'

export default {
  // 关闭当前tab页
  close() {
    store.dispatch('tab/removeTab', router.currentRoute)
  },
}
