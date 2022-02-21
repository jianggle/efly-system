const Router = require('koa-router')
const router = new Router()
const MenuController = require('@app/controller/menu-controller')

router.get('/menu/listMenu', MenuController.listMenuAction)
router.get('/menu/listSimpleMenu', MenuController.listSimpleMenuAction)
router.post('/menu/addMenu', MenuController.addMenuAction)
router.post('/menu/modifyMenu', MenuController.modifyMenuAction)
router.post('/menu/deleteMenu', MenuController.deleteMenuAction)
router.post('/menu/modifyMenuOrder', MenuController.modifyMenuOrderAction)

module.exports = router
