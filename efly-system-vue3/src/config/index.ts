const AppConfig = {
  /**系统名称 */
  siteName: 'efly system',
  /**部署目录 */
  publicPath: import.meta.env.VITE_APP_BASE_URL as string,
  /**api路径 */
  apiBaseURL: `${import.meta.env.VITE_APP_BASE_API}/manage-api/`,
  /**编辑器资源文件目录 */
  editorPath: `${import.meta.env.VITE_APP_BASE_API}/publicAssets/kindeditor/`,
  /**本地存储token时的key名称 */
  tokenKey: 'token',
  /**是否启用设置功能 */
  enableSetting: true,
  /**默认布局配置 */
  setting: {
    /**全局组件尺寸 */
    size: 'default',
    /**主题颜色 */
    theme: '#409EFF',
    /**导航模式 */
    navMode: 'app-nav-left',
    /**是否启用标签栏 */
    tagsView: true,
    /**是否固定Header */
    fixedHeader: true,
    /**是否展示侧边栏Logo */
    sidebarLogo: true,
    /**是否启用动态标题 */
    dynamicTitle: true,
  },
  // 是否开启水印
  watermark: false,
}

export default AppConfig
