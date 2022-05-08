const { ServiceException, responseError } = require('@app/utils/resModel')
const { logger } = require('@app/utils/logger')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (error instanceof ServiceException) {
      await responseError(ctx, error.code, error.message)
    } else {
      console.log(error)
      logger.error(error)
      await responseError(ctx, 500, error.message || error.toString() || '内部服务错误')
    }
  }
}
