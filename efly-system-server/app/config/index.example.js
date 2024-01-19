// 数据库配置
export const dbConfig = {
  host: 'localhost',
  port: '3306',
  user: 'your db user',
  password: 'your db password',
  database: 'your db database',
}

// 数据库表
export const dbTables = {
  SYSTEM_USER: 'sys_user',
  SYSTEM_USER_ROLE: 'sys_user_role',
  SYSTEM_ROLE: 'sys_role',
  SYSTEM_ROLE_MENU: 'sys_role_menu',
  SYSTEM_MENU: 'sys_menu',
  SYSTEM_LOG_LOGIN: 'sys_log_login',

  CMS_ARTICLE: 'cms_article',
  CMS_ARTICLE_TAG: 'cms_article_tag',
  CMS_CATEGORY: 'cms_category',
  CMS_TAG: 'cms_tag',
  CMS_LINK: 'cms_link',
  CMS_LINK_CATEGORY: 'cms_link_category',
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
export const jwtSecret = '#123456789JQKA@abcdefg#'
// 请求头中存储token的key
export const tokenKey = 'authorization'
// token有效期
export const tokenExpire = 3 * 24 * 60 * 60
