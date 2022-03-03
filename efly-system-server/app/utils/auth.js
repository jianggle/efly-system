const jwt = require('jsonwebtoken')
const md5 = require('blueimp-md5')
const { tokenExpire, tokenKey, jwtSecret } = require('@app/config')
const LogModel = require('@app/model/sys_log_login')

const authLogin = async function (userId) {
  const token = jwt.sign({
    expiresIn: tokenExpire,
    data: {
      userId
    }
  }, jwtSecret)
  return token
}

const authCheck = async function (token) {
  try {
    const decoded = jwt.verify(token, jwtSecret)
    const diff = Math.floor(Date.now() / 1000) - decoded.iat
    const tokenId = md5(token)
    if (diff > decoded.expiresIn) {
      await LogModel.outTokenStatusBySelf(tokenId)
      throw '已过期'
    }
    const res = await LogModel.getOneByToken(tokenId)
    if (res.online !== 0) return null
    return decoded.data.userId
  } catch (err) {
    return null
  }
}

const authLogout = function (ctx) {
  const token = ctx.request.header[tokenKey]
  if (!token) return Promise.resolve()
  return LogModel.outTokenStatusBySelf(md5(token))
}

module.exports = {
  authLogin,
  authCheck,
  authLogout,
}
