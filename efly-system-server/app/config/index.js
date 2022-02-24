// 数据库配置
exports.dbConfig = {
  host: 'localhost',
  port: '3306',
  user: 'db_efly_system',
  password: 'test123456abc',
  database: 'db_efly_system',
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
}

// 七牛云配置
exports.qiniuConfig = {
  accessKey: process.env.QINIU_ACCESS_KEY,
  secretKey: process.env.QINIU_SECRET_KEY,
  bucket: process.env.QINIU_BUCKET,
  siteDomain: process.env.QINIU_DOMAIN,
}

// 验证码有效期
exports.captchaExpire = 2 * 60

// token有效期
exports.tokenExpire = 3 * 24 * 60 * 60

// 请求头中存储token的key
exports.tokenKey = 'authorization'
