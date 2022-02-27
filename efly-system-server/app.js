const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const Moment = require('moment')
const path = require('path')
const staticCache = require('koa-static-cache')
const tplRender = require('koa-art-template')

require('dotenv').config()

const moduleAlias = require('module-alias')
moduleAlias.addAliases({
  '@app': __dirname + '/app'
})

// 让vue-router使用history模式时定向到index.html
const historyApiFallback = require('@app/middleware/connect-history-api-fallback')
app.use(historyApiFallback({
  path: '/admin-vue2',
  index: '/index.html'
}))

const { accessLogger } = require('@app/utils/logger')
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

app.use(require('@app/middleware/header-middleware'))
app.use(require('@app/middleware/global-exception'))

app.use(require('@app/router/backend').routes())
app.use(require('@app/router/frontend').routes())

tplRender(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: true
})

app.listen(9998, () => {
  console.log('Server is listening on http://localhost:9998')
})
