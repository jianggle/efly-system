const Router = require('koa-router')
const router = new Router()
const RoleController = require('@app/controller/role-controller')

router.get('/role/listRole', RoleController.listRoleAction)
router.get('/role/listSimpleRole', RoleController.listSimpleRoleAction)
router.post('/role/addRole', RoleController.addRoleAction)
router.post('/role/modifyRole', RoleController.modifyRoleAction)
router.post('/role/deleteRole', RoleController.deleteRoleAction)

module.exports = router
