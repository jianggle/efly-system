const authBackend = require('@app/middleware/auth-middleware')
const router = require('@koa/router')({
  prefix: '/manage-api'
})
router.use(authBackend({
  unlessToken: [
    /^\/manage-api\/base\/(captchaImage|userLogin|userLogout)$/,
  ],
  unlessPermit: [
    /^\/manage-api\/base\//,
  ]
}))

const glob = require('glob')
const path = require('path')
glob.sync(path.resolve(__dirname, './', '**/*-router.js')).forEach(item => {
  router.use('', require(item).routes())
})

module.exports = router
