const { ServiceException } = require('@app/utils/resModel')
const { checkToken } = require('@app/utils/auth')
const { getUserPermit } = require('@app/controller/system/user')
const { tokenKey } = require('@app/config')
const LogModel = require('@app/model/sys_log_login')
const md5 = require('blueimp-md5')

module.exports = ({ unlessToken = [], unlessPermit = [] }) => {
  return async (ctx, next) => {
    const reqPath = ctx.request.url.split('?')[0]
    // 放过验证码、登录、退出等此类接口
    if (unlessToken.some(item => item.test(reqPath))) {
      return next()
    }

    const token = (ctx.request.header[tokenKey] || '').trim()
    if (!token) {
      throw new ServiceException('未授权访问', 401)
    }

    const tokenId = md5(token)
    const userInfo = checkToken(token)
    if (!userInfo) {
      throw new ServiceException('凭证无效', 401)
    }
    // 如果token失效，更新对应标记
    if (userInfo === 'invalid') {
      await LogModel.outTokenStatusBySelf(tokenId)
      throw new ServiceException('凭证已过期', 401)
    }
    // 判断是否被标记失效
    const res = await LogModel.getOneByToken(tokenId)
    if (res.online !== 0) {
      throw new ServiceException('凭证被强制销毁', 401)
    }

    // 用户信息挂载到state
    ctx.state.user = userInfo

    // 校验需要鉴权的路由
    if (!unlessPermit.some(item => item.test(reqPath))) {
      const { validApis } = await getUserPermit(userInfo.id)
      if (!validApis.includes(reqPath)) {
        throw new ServiceException('对不起，您无权访问该接口', 403)
      }
    }

    // 放过不需要鉴权和鉴权通过的
    await next()
  }
}
