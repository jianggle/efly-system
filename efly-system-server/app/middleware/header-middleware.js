import { tokenKey } from '#config/index.js'

export async function responseHeadersMiddleware(ctx, next) {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Headers', `Content-Type, ${tokenKey}`)
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  if (ctx.method == 'OPTIONS') {
    ctx.status = 200
  } else {
    await next()
  }
}
