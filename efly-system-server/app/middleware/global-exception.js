const { isCustomException } = require('../utils/custom-exception')
const { isRedisException } = require('../utils/redis')
const { logger } = require('../utils/logger')
const { logSucceed, logFailed } = require('../utils/log')

module.exports = async (ctx, next) => {
  try {
    await next()
    await logSucceed(ctx)
  } catch (error) {
    logFailed(ctx, error).catch(reason => {
      console.log(reason)
      logger.error(reason)
    })
    if (isCustomException(error)) {
      ctx.body = {
        code: error.code,
        msg: error.message
      }
    } else {
      console.log(error)
      logger.error(error)
      if (isRedisException(error)) {
        ctx.body = {
          code: -1,
          msg: 'redis sth error'
        }
      } else {
        ctx.body = {
          code: 500,
          msg: error.message || error.toString() || '内部服务错误'
        }
      }
    }
    ctx.status = 200
  }
}
