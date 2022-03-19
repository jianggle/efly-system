// 数据库配置
exports.dbConfig = {
  host: 'localhost',
  port: '3306',
  user: 'your db user',
  password: 'your db password',
  database: 'your db database',
}

// 数据库表
exports.dbTables = {
  SYSTEM_USER: 'sys_user',
  SYSTEM_USER_ROLE: 'sys_user_role',
  SYSTEM_ROLE: 'sys_role',
  SYSTEM_ROLE_MENU: 'sys_role_menu',
  SYSTEM_MENU: 'sys_menu',
  SYSTEM_LOG_LOGIN: 'sys_log_login',

  BLOG_ARTICLE: 'blog_article',
  BLOG_ARTICLE_TAG: 'blog_article_tag',
  BLOG_CATEGORY: 'blog_category',
  BLOG_TAG: 'blog_tag',
  BLOG_LINK: 'blog_link',
  BLOG_LINK_CATEGORY: 'blog_link_category',

  BILL_RECORD: 'bill_record',
  BILL_BOOK: 'bill_book',
  BILL_BOOK_RECORD: 'bill_book_record',
}

// 七牛云配置
exports.qiniuConfig = {
  accessKey: 'your qiniu accessKey',
  secretKey: 'your qiniu secretKey',
  bucket: 'your qiniu bucket',
  siteDomain: 'your qiniu domain',
}

// session配置
exports.appKeys = new Array(Math.floor(Math.random() * 10) + 1).fill().map(() => Math.random() + '')
exports.sessionConfig = {
  keys: 'koa:sess',
  maxAge: 86400000
}

// jwt secret
exports.jwtSecret = '#123456789JQKA@abcdefg#'
// 请求头中存储token的key
exports.tokenKey = 'authorization'
// token有效期
exports.tokenExpire = 3 * 24 * 60 * 60
