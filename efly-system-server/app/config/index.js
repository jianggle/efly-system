// 数据库配置
export const dbConfig = {
  host: 'localhost',
  port: '3306',
  user: 'efly_system',
  password: 'demo123456',
  database: 'efly_system',
  charset: 'utf8mb4_general_ci',
  timezone: '+08:00', // 统一按东八区读写 DATETIME，避免依赖部署环境时区
  waitForConnections: true,
  connectionLimit: 20, // 根据并发和进程数调整
  maxIdle: 10, // 最大空闲连接数（小于connectionLimit，低峰期收缩）
  idleTimeout: 60000, // 空闲连接超时（毫秒）
  queueLimit: 100, // 设置有限队列，避免无限堆积
  enableKeepAlive: true, // 让操作系统发送 TCP 保活探测包，防止连接因中间网络设备空闲超时而中断
  keepAliveInitialDelay: 10000, // 10秒后开始发送保活探测
  gracefulEnd: true, // 启用连接池的优雅关闭
}

// 数据库表
export const dbTables = {
  SYS_USER: 'sys_user',
  SYS_USER_ROLE: 'sys_user_role',
  SYS_ROLE: 'sys_role',
  SYS_ROLE_MENU: 'sys_role_menu',
  SYS_MENU: 'sys_menu',
  SYS_LOGIN_LOG: 'sys_login_log',

  CMS_ARTICLE: 'cms_article',
  CMS_ARTICLE_TAG: 'cms_article_tag',
  CMS_CATEGORY: 'cms_category',
  CMS_TAG: 'cms_tag',
  CMS_LINK: 'cms_link',
  CMS_LINK_CATEGORY: 'cms_link_category',

  FT_TREE: 'ft_tree',
  FT_PERSON: 'ft_person',
  FT_RELATIONSHIP: 'ft_relationship',
}

// 七牛云配置
export const qiniuConfig = {
  accessKey: 'your qiniu accessKey',
  secretKey: 'your qiniu secretKey',
  bucket: 'your qiniu bucket',
  siteDomain: 'your qiniu domain',
}

// session配置
export const appKeys = new Array(Math.floor(Math.random() * 10) + 1)
  .fill()
  .map(() => Math.random() + '')
export const sessionConfig = {
  keys: 'koa:sess',
  maxAge: 86400000,
}

// jwt secret
export const jwtSecret = '#A123456789JQK@abcdefg*#'
// 请求头中存储token的key
export const tokenKey = 'authorization'
// token有效期
export const tokenExpire = 3 * 24 * 60 * 60
