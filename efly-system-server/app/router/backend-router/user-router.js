const Router = require('koa-router')
const router = new Router()
const UserController = require('../../controller/user-controller')

router.post('/user/addUser', UserController.addUserAction)
router.post('/user/modifyUser', UserController.modifyUserAction)
router.post('/user/deleteUser', UserController.deleteUserAction)
router.get('/user/listUser', UserController.listUserAction)

module.exports = router
