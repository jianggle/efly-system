const Router = require('koa-router')
const router = new Router()
const LogController = require('@app/controller/log-controller')

router.get('/log/listLoginLog', LogController.listLoginLogAction)
router.post('/log/resetLoginLog', LogController.resetLoginLogAction)

module.exports = router
