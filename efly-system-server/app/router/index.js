const router = require('koa-router')({
  prefix: '/manage-api'
})
router.use(require('../middleware/auth-middleware'))

const glob = require('glob')
const path = require('path')
glob.sync(path.resolve(__dirname, './backend-router/', '**/*.js')).forEach(item => {
  router.use('', require(item).routes())
})

module.exports = router
