const appConfigSetting: {
  /**全局组件尺寸 */
  size: 'default' | 'small' | 'large'
  /**主题颜色 */
  theme: string
  /**布局模式 */
  navMode: 'app-nav-left' | 'app-nav-leftop' | 'app-nav-top'
  /**是否启用标签栏 */
  tagsView: boolean
  /**是否固定Header */
  fixedHeader: boolean
  /**是否展示侧边栏Logo */
  sidebarLogo: boolean
  /**是否启用动态标题 */
  dynamicTitle: boolean
} = {
  size: 'default',
  theme: '#409EFF',
  navMode: 'app-nav-left',
  tagsView: true,
  fixedHeader: true,
  sidebarLogo: true,
  dynamicTitle: true,
}

const AppConfig = {
  /**系统名称 */
  siteName: import.meta.env.VITE_APP_TITLE as string,
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
  setting: appConfigSetting,
  // 是否开启水印
  watermark: false,
}

export default AppConfig
