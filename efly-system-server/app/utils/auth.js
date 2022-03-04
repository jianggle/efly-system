const jwt = require('jsonwebtoken')
const md5 = require('blueimp-md5')
const { tokenExpire, tokenMpExpire, tokenKey, jwtSecret } = require('@app/config')
const LogModel = require('@app/model/sys_log_login')

const createToken = (payload, expiresIn) => {
  return jwt.sign({
    expiresIn: expiresIn,
    data: payload
  }, jwtSecret)
}

const checkToken = (token) => {
  try {
    const decoded = jwt.verify(token, jwtSecret)
    const diff = Math.floor(Date.now() / 1000) - decoded.iat
    if (diff > decoded.expiresIn) return 'invalid'
    return decoded.data
  } catch (err) {
    return null
  }
}

const authLogin = (payload) => {
  return createToken(payload, tokenExpire)
}
const authLogout = function (ctx) {
  const token = ctx.request.header[tokenKey]
  if (!token) return Promise.resolve()
  return LogModel.outTokenStatusBySelf(md5(token))
}

const authMpLogin = (payload) => {
  return createToken(payload, tokenMpExpire)
}

module.exports = {
  checkToken,
  authLogin,
  authLogout,
  authMpLogin,
}
