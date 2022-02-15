export default {
  namespaced: true,
  state: {
    sidebarOpened: true,
    // desktop mobile
    device: 'desktop',
  },
  mutations: {
    TOGGLE_SIDEBAR(state) {
      state.sidebarOpened = !state.sidebarOpened
    },
    CLOSE_SIDEBAR(state) {
      state.sidebarOpened = false
    },
    OPEN_SIDEBAR(state) {
      state.sidebarOpened = true
    },
    UPDATE_DEVICE(state, payload) {
      state.device = payload
    }
  }
}
