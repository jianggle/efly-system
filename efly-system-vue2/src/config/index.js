module.exports = {
  // 开发环境
  isDev: process.env.NODE_ENV === 'development',
  // 生产环境
  isProd: process.env.NODE_ENV === 'production',
  // 系统名称
  siteName: 'efly system',
  // 部署目录
  publicPath: process.env.BASE_URL,
  // api路径
  apiBaseURL: `${process.env.VUE_APP_BASE_API}/manage-api/`,
  // 编辑器资源文件目录
  editorPath: `${process.env.VUE_APP_BASE_API}/publicAssets/kindeditor/`,
  // 本地存储token时的key名称
  tokenKey: 'token',
  // 是否使用cdn，启用时需注释掉main.js中的element-ui样式表
  useCdn: false,
  // 是否使用`DllPlugin`动态链接库（`useCdn`为`false`时`useDll`才会生效）
  useDll: false,
  // 是否使用HappyPack多线程打包（复杂项目开启后提速明显）
  useHappyPack: false,
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
  // 打包时是否移除`console`
  removConsole: true,
  // 移除`console`时排除的方法
  removExcludeConsole: ['error', 'warn'],
}
