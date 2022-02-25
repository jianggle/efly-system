const router = require('koa-router')({
  prefix: '/manage-api'
})
router.use(require('@app/middleware/auth-middleware'))

const glob = require('glob')
const path = require('path')
glob.sync(path.resolve(__dirname, './', '**/*-router.js')).forEach(item => {
  router.use('', require(item).routes())
})

module.exports = router
