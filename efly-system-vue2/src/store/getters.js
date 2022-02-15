const getters = {
  sidebarOpened: state => state.app.sidebarOpened,
  device: state => state.app.device,
  permissions: state => state.user.permissions,
  permission_routes: state => state.user.routes,
  userId: state => state.user.info.id,
  userName: state => state.user.info.name,
  userAvatar: state => state.user.info.avatar,
  sidebarMenu: state => state.user.sidebarMenu.filter(item => !item.hidden),
  navMode: state => state.sysLayout.navMode,
}

export default getters
