const { NODE_ENV, VUE_APP_API_ENV } = process.env
const isLocalApi = VUE_APP_API_ENV !== 'production'
const isDev = NODE_ENV === 'development'

module.exports = {
  // 开发环境
  isDev,
  // 生产环境
  isProd: NODE_ENV === 'production',
  // 系统名称
  siteName: 'efly system',
  // 部署目录
  publicPath: isDev ? '/' : '/admin-vue2/',
  // api路径
  apiBaseURL: isLocalApi ? '/manage-api/' : 'https://example.com/manage-api/',
  // 本地存储token时的key名称
  tokenKey: 'token',
  // 是否使用cdn，启用时需注释掉main.js中的element-ui样式表
  useCdn: false,
  // 是否启用gzip
  useGzip: true,
  // 默认布局配置
  layoutSettings: {
    theme: '#409EFF',
    size: 'medium',
    navMode: 'app-nav-left',
    tagsView: true,
    fixedHeader: true,
    sidebarLogo: true,
    dynamicTitle: true,
  },
  // 是否开启水印
  watermark: false,
}
