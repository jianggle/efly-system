import path from 'path'
import log4js from '#plugins/koa-log4.js'

log4js.configure({
  appenders: {
    access: {
      type: 'dateFile',
      filename: path.join('logs/', 'access'),
      fileNameSep: '-',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
    application: {
      type: 'dateFile',
      filename: path.join('logs/', 'application'),
      fileNameSep: '-',
      pattern: 'yyyy-MM-dd.log',
      alwaysIncludePattern: true,
    },
    out: {
      type: 'stdout',
    },
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'info',
    },
    access: {
      appenders: ['access'],
      level: 'info',
    },
    application: {
      appenders: ['application'],
      level: 'warn',
    },
  },
})

// 记录所有访问级别的日志
export const accessLogger = () => log4js.koaLogger(log4js.getLogger('access'))

// 记录所有应用级别的日志
export const appLogger = log4js.getLogger('application')
