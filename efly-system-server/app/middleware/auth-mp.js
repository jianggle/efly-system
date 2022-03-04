const { CustomException } = require('@app/utils/custom-exception')
const { checkToken } = require('@app/utils/auth')
const { tokenKey } = require('@app/config')

module.exports = ({ unless = [] }) => {
  return async (ctx, next) => {
    const reqPath = ctx.request.url.split('?')[0]
    // 只处理需要鉴权的路由
    if (!unless.some(item => item.test(reqPath))) {
      let token = (ctx.request.header[tokenKey] || '').trim()
      if (!token || !token.startsWith('Bearer ')) {
        throw new CustomException('未授权访问', 401)
      }
      token = token.split(' ')[1]
      const userInfo = checkToken(token)
      if (!userInfo || userInfo === 'invalid') {
        throw new CustomException('凭证无效或已过期', 401)
      }
      ctx.state.user = userInfo
    }
    // 放过不需要鉴权和鉴权通过的
    await next()
  }
}
