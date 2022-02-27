const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const koaLogger = require('koa-logger')
const Moment = require('moment')
const path = require('path')
const staticCache = require('koa-static-cache')
const tplRender = require('koa-art-template')

// 挂载自定义环境变量
require('dotenv').config()

// 配置路径别名，搭配jsconfig.json
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

// 记录请求日志
const { accessLogger } = require('@app/utils/logger')
app.use(accessLogger())

// 控制台输出请求日志
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

// 请求头校验
app.use(require('@app/middleware/header-middleware'))
// 全局异常处理
app.use(require('@app/middleware/global-exception'))

// 后端接口路由
app.use(require('@app/router/backend').routes())
// 前端博客路由
app.use(require('@app/router/frontend').routes())

// 配置模板引擎
tplRender(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: true,
  imports: {
    dateFormat(date, format) {
      return Moment(date).format(format)
    }
  }
})

app.listen(9998, () => {
  console.log('Server is listening on http://localhost:9998')
})
