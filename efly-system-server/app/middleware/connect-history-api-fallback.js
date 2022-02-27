const url = require('url')

// 参考https://github.com/bripkens/connect-history-api-fallback
module.exports = function (options) {
  options = options || {}
  options.path = options.path || ''
  options.index = options.index || '/index.html'

  return async (ctx, next) => {
    if (!ctx.url.startsWith(options.path)) {
      return next()
    } else if (ctx.method !== 'GET') {
      return next()
    }

    const parsedUrl = url.parse(ctx.url)
    if (parsedUrl.pathname.indexOf('.') !== -1) {
      return next()
    }

    ctx.url = options.path + options.index
    await next()
  }
}
