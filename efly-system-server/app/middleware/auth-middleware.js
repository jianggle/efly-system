const { CustomException } = require('@app/utils/custom-exception')
const { authCheck } = require('@app/utils/auth')
const { getUserPermit } = require('@app/controller/system/user')
const { tokenKey } = require('@app/config')

const unlessToken = [
  '/manage-api/base/captchaImage',
  '/manage-api/base/userLogin',
  '/manage-api/base/userLogout',
]

const unlessPermit = [
  { type: 'regexp', path: '^/manage-api/base/.*' },
  // { type: 'normal', path: '/manage-api/sth/testSth' },
]

module.exports = async (ctx, next) => {
  const reqUrl = ctx.request.url
  if (!unlessToken.includes(reqUrl)) {
    let token = ctx.request.header[tokenKey]
    if (!token) {
      throw new CustomException('未授权访问', 401)
    }

    const userId = await authCheck(token)
    if (!userId) {
      throw new CustomException('凭证无效或已过期', 401)
    }
    ctx.state.userId = userId

    const reqPath = reqUrl.split('?')[0]
    const isUnless = unlessPermit.some(item => {
      if (item.type === 'normal' && reqPath === item.path) return true
      if (item.type === 'regexp' && new RegExp(item.path).test(reqPath)) return true
      return false
    })
    if (!isUnless) {
      const { validApis } = await getUserPermit(userId)
      if (!validApis.includes(reqPath)) {
        throw new CustomException('对不起，您无权访问该接口', 403)
      }
    }
  }
  ctx.state.isBackend = true
  await next()
}
