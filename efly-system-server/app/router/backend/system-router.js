const CommonController = require('@app/controller/common')
const UserController = require('@app/controller/system/user')
const LogController = require('@app/controller/system/log')
const MenuController = require('@app/controller/system/menu')
const RoleController = require('@app/controller/system/role')

const Router = require('@koa/router')
const router = new Router()

const upload = require('@app/utils/upload')

router.get('/base/captchaImage', CommonController.captchaAction)

router.post('/base/userLogin', UserController.loginAction)
router.post('/base/userLogout', UserController.logoutAction)

router.get('/base/userPermit', UserController.permitAction)
router.get('/base/userInfo', UserController.infoUserAction)
router.get('/base/userLoginLog', LogController.listUserLoginLogAction)
router.post('/base/modifyUserAvatar', upload().single('file'), UserController.modifyUserAvatarAction)
router.post('/base/modifyUserInfo', UserController.modifyUserInfoAction)
router.post('/base/modifyUserPwd', UserController.modifyUserPwdAction)
router.post('/base/modifyUserSetting', UserController.modifyUserSettingAction)

router.post('/user/addUser', UserController.addUserAction)
router.post('/user/modifyUser', UserController.modifyUserAction)
router.post('/user/deleteUser', UserController.deleteUserAction)
router.get('/user/listUser', UserController.listUserAction)

router.get('/user/listOnlineUser', LogController.listOnlineUserAction)
router.post('/user/deleteOnlineUser', LogController.deleteOnlineUserAction)

router.get('/menu/listMenu', MenuController.listMenuAction)
router.get('/menu/listSimpleMenu', MenuController.listSimpleMenuAction)
router.post('/menu/addMenu', MenuController.addMenuAction)
router.post('/menu/modifyMenu', MenuController.modifyMenuAction)
router.post('/menu/deleteMenu', MenuController.deleteMenuAction)
router.post('/menu/modifyMenuOrder', MenuController.modifyMenuOrderAction)

router.get('/log/listLoginLog', LogController.listLoginLogAction)

router.get('/role/listRole', RoleController.listRoleAction)
router.get('/role/listSimpleRole', RoleController.listSimpleRoleAction)
router.post('/role/addRole', RoleController.addRoleAction)
router.post('/role/modifyRole', RoleController.modifyRoleAction)
router.post('/role/deleteRole', RoleController.deleteRoleAction)

module.exports = router
