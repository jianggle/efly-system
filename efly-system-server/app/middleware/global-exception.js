const { isCustomException } = require('@app/utils/custom-exception')
const { isRedisException } = require('@app/utils/redis')
const { logger } = require('@app/utils/logger')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
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
