const Redis = require('ioredis')

// https://github.com/luin/ioredis
// 默认连接 127.0.0.1:6379
const redis = new Redis({
  // host: '127.0.0.1',
  // port: 6379,
  // password: '123456',
  // 调试时可打开，否则影响性能
  // showFriendlyErrorStack: false,
})

const isRedisException = function (err) {
  return err instanceof Redis.ReplyError
}

module.exports = {
  redis,
  isRedisException
}
