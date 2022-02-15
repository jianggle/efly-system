const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const Moment = require('moment')
const path = require('path')
const staticCache = require('koa-static-cache')

require('dotenv').config()

// 让vue-router使用history模式时定向到index.html
// https://github.com/bripkens/connect-history-api-fallback
// https://github.com/idseventeen/koa2-connect-history-api-fallback
const { historyApiFallback } = require('koa2-connect-history-api-fallback')
app.use(historyApiFallback({
  whiteList: ['/manage-api']
}))

const { accessLogger } = require('./app/utils/logger')
app.use(accessLogger())

app.use(koaLogger((str) => {
  console.log(Moment().format('YYYY-MM-DD HH:mm:ss') + str)
}))

// 注册静态目录
// https://github.com/koajs/static-cache
app.use(staticCache(path.join(__dirname, 'public'), {
  maxAge: 365 * 24 * 60 * 60,
  gzip: true
}))

app.use(bodyParser())

app.use(require('./app/middleware/header-middleware'))
app.use(require('./app/middleware/global-exception'))

app.use(require('./app/router/index').routes())

app.listen(9998, () => {
  console.log('Server is listening on http://localhost:9998')
})
