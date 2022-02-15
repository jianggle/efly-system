exports.dbConfig = {
  host: 'localhost',
  port: '3306',
  user: 'db_efly_system',
  password: 'test123456abc',
  database: 'db_efly_system',
}

exports.qiniuConfig = {
  accessKey: process.env.QINIU_ACCESS_KEY,
  secretKey: process.env.QINIU_SECRET_KEY,
  bucket: process.env.QINIU_BUCKET,
  siteDomain: process.env.QINIU_DOMAIN,
}
