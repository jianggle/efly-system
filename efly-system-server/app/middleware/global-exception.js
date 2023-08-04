import { ServiceException, responseError } from '#utils/resModel.js'
import { appLogger } from '#utils/logger.js'

export async function globalExceptionMiddleware(ctx, next) {
  try {
    await next()
  } catch (error) {
    if (error instanceof ServiceException) {
      await responseError(ctx, error.code, error.message)
    } else {
      console.log(error)
      appLogger.error(error)
      await responseError(ctx, 500, error.message || error.toString() || '内部服务错误')
    }
  }
}
