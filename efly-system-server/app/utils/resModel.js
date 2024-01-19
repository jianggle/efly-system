class ServiceException extends Error {
  constructor(msg = 'sth error', code = -1, status = null) {
    super()
    this.message = msg
    this.code = code
    this.status = status
  }
}

class HttpResponse {
  constructor(code, msg, data) {
    this.code = code
    this.msg = msg || 'success'
    if (data) {
      this.data = data
    }
  }
  success(ctx) {
    ctx.body = this
  }
}

const responseSuccess = async (ctx, data, msg) => {
  return new HttpResponse(0, msg, data).success(ctx)
}
const responseError = async (ctx, code, msg) => {
  return new HttpResponse(code, msg).success(ctx)
}

export { ServiceException, responseSuccess, responseError }
