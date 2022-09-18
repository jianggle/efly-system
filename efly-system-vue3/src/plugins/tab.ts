import router from '@/router'
import useTabStore from '@/store/modules/tab'

export default {
  /**关闭当前tab页 */
  close() {
    useTabStore().removeTab(router.currentRoute.value)
  },
}
