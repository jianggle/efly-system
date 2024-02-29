const getters = {
  sidebarOpened: (state) => state.app.sidebar.opened,
  device: (state) => state.app.device,
  permissions: (state) => state.user.permissions,
  permission_routes: (state) => state.user.routes,
  userId: (state) => state.user.info.id,
  userName: (state) => state.user.info.name,
  userAvatar: (state) => state.user.info.avatar,
  allVisibleMenu: (state) => {
    return (state.user.routes || []).filter((item) => item.meta && item.meta.title && item.meta.isMenu)
  },
  sidebarVisibleMenu: (state) => {
    return (state.user.sidebarMenu || []).filter((item) => item.meta && item.meta.title && item.meta.isMenu)
  },
  navMode: (state) => state.app.setting.navMode,
}

export default getters
