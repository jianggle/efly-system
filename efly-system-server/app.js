import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import koaLogger from 'koa-logger'
import koaStatic from 'koa-static'
import tplRender from 'koa-art-template'
import koaSession from 'koa-session'
import dotenv from 'dotenv'
import dayjs from 'dayjs'

import path from 'path'
import { fileURLToPath } from 'url'
import os from 'os'

import { historyApiFallback } from '#middleware/connect-history-api-fallback.js'
import { accessLogger } from '#utils/logger.js'
import { sessionConfig, appKeys } from '#config/index.js'
import { responseHeadersMiddleware } from '#middleware/header-middleware.js'
import { globalExceptionMiddleware } from '#middleware/global-exception.js'

import frontendRouter from '#app/router/frontend/index.js'
import backendRouter from '#app/router/backend/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = new Koa()

// 挂载自定义环境变量
dotenv.config()

// 让vue-router使用history模式时定向到index.html
app.use(historyApiFallback({
  path: '/admin-vue2',
  index: '/index.html'
}))
app.use(historyApiFallback({
  path: '/admin-vue3',
  index: '/index.html'
}))

// 记录请求日志
app.use(accessLogger())

// 控制台输出请求日志
app.use(koaLogger((str) => {
  console.log(dayjs().format('YYYY-MM-DD HH:mm:ss') + str)
}))

// 注册静态目录
app.use(koaStatic(path.join(__dirname, 'public'), {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  gzip: true
}))

// 注册session服务
app.keys = appKeys
app.use(koaSession(sessionConfig, app))

app.use(bodyParser())

// 请求头校验
app.use(responseHeadersMiddleware)
// 全局异常处理
app.use(globalExceptionMiddleware)

// 后端接口路由
app.use(backendRouter.routes())
// 前端博客路由
app.use(frontendRouter.routes())

// 配置模板引擎
tplRender(app, {
  root: path.join(__dirname, 'views'),
  extname: '.art',
  debug: process.env.NODE_ENV !== 'production',
  imports: {
    dateFormat(date, format) {
      return dayjs(date).format(format)
    }
  }
})

const serverPort = process.env.EFLY_SERVER_PORT
app.listen(serverPort, () => {
  console.log('--> Server is running at ' + dayjs().format('YYYY-MM-DD HH:mm:ss'))
  console.log(`--> Local:   http://localhost:${serverPort}/`)
  const networkInterfaces = os.networkInterfaces()
  Object.values(networkInterfaces).forEach(list => {
    list.forEach(ipInfo => {
      if(ipInfo.family === 'IPv4' && !ipInfo.internal) {
        console.log(`--> Network: http://${ipInfo.address}:${serverPort}/`)
      }
    })
  })
})
