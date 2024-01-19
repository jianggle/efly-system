import * as CommonController from '#controller/common.js'
import * as UserController from '#controller/system/user.js'
import * as LogController from '#controller/system/log.js'
import * as MenuController from '#controller/system/menu.js'
import * as RoleController from '#controller/system/role.js'

import upload from '#utils/upload.js'

import Router from '@koa/router'

const router = new Router()

router.get('/base/captchaImage', CommonController.captchaAction)

router.post('/base/userLogin', UserController.loginAction)
router.post('/base/userLogout', UserController.logoutAction)

router.get('/base/userPermit', UserController.permitAction)
router.get('/base/userInfo', UserController.infoUserAction)
router.get('/base/userLoginLog', LogController.listUserLoginLogAction)
router.post(
  '/base/modifyUserAvatar',
  upload().single('file'),
  UserController.modifyUserAvatarAction
)
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

export default router
