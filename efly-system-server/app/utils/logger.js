const path = require('path')
const log4js = require('koa-log4')

log4js.configure({
  appenders: {
    access: {
      type: 'dateFile',
      filename: path.join('logs/', 'access'),
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    application: {
      type: 'dateFile',
      filename: path.join('logs/', 'application'),
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true
    },
    out: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'info'
    },
    access: {
      appenders: ['access'],
      level: 'info'
    },
    application: {
      appenders: ['application'],
      level: 'WARN'
    }
  }
})

// 记录所有访问级别的日志
exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access'))

// 记录所有应用级别的日志
exports.logger = log4js.getLogger('application')
