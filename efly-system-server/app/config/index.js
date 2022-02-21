// 数据库配置
exports.dbConfig = {
  host: 'localhost',
  port: '3306',
  user: 'db_efly_system',
  password: 'test123456abc',
  database: 'db_efly_system',
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
