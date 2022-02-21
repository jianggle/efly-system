const { tokenKey } = require('@app/config')

module.exports = async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Headers', `Content-Type, ${tokenKey}`)
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  if (ctx.method == 'OPTIONS') {
    ctx.status = 200
  } else {
    await next()
  }
}
