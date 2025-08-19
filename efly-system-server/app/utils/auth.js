import jwt from 'jsonwebtoken'
import md5 from 'blueimp-md5'
import { tokenExpire, tokenKey, jwtSecret } from '#config/index.js'
import SysLoginLogModel from '#project/system/model/SysLoginLogModel.js'

const createToken = (payload, expiresIn) => {
  return jwt.sign(
    {
      expiresIn: expiresIn,
      data: payload,
    },
    jwtSecret
  )
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
  return SysLoginLogModel.outTokenStatusBySelf(md5(token))
}

export { checkToken, authLogin, authLogout }
