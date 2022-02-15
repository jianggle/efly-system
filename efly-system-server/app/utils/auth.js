const { redis } = require('../utils/redis')
const { v4: uuidv4 } = require('uuid')

const authLogin = async function (userId) {
  const token = 'token' + uuidv4()
  await redis.set(token, userId, 'EX', 3 * 24 * 60 * 60)
  return token
}

const authCheck = async function (token) {
  const userId = await redis.get(token)
  return userId
}

const authLogout = function (ctx) {
  const token = ctx.request.header['authorization']
  if (!token) return Promise.resolve()
  return redis.del(token)
}

module.exports = {
  authLogin,
  authCheck,
  authLogout,
}
