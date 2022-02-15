const qiniu = require('qiniu')
const { qiniuConfig } = require('../config')

const uploadToQiniu = (filePath, key) => {
  const {
    accessKey,
    secretKey,
    siteDomain
  } = qiniuConfig

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const putPolicy = new qiniu.rs.PutPolicy({
    scope: qiniuConfig.bucket,
  })
  const uploadToken = putPolicy.uploadToken(mac)

  const localFile = filePath

  const putExtra = new qiniu.form_up.PutExtra()

  const config = new qiniu.conf.Config()
  config.zone = qiniu.zone.Zone_z2

  const formUploader = new qiniu.form_up.FormUploader(config)

  return new Promise((resolved, reject) => {
    // uploadToken是token， key是上传到七牛后保存的文件名,
    formUploader.putStream(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
      if (respErr) {
        return reject(respErr)
      }
      if (respInfo.statusCode == 200) {
        resolved(Object.assign({}, respBody, {
          fileUrl: siteDomain + respBody.key
        }))
      } else {
        reject(respBody.error)
      }
    })
  })
}

const deleteQiniuItem = (fileUrl) => {
  const {
    accessKey,
    secretKey,
    bucket,
    siteDomain
  } = qiniuConfig

  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
  const config = new qiniu.conf.Config()

  //config.useHttpsDomain = true;
  config.zone = qiniu.zone.Zone_z2
  const bucketManager = new qiniu.rs.BucketManager(mac, config)

  const key = fileUrl.replace(siteDomain, '')

  return new Promise((resolved, reject) => {
    bucketManager.delete(bucket, key, function (err, respBody, respInfo) {
      if (err) {
        return reject(err)
      }
      if (respInfo.statusCode == 200) {
        resolved(respInfo.statusMessage)
      } else {
        reject(respBody.error)
      }
    })
  })
}

module.exports = {
  uploadToQiniu,
  deleteQiniuItem,
}
