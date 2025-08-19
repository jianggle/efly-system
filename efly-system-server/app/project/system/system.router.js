import * as CommonController from '#project/CommonController.js'
import * as SysUserController from './controller/SysUserController.js'
import * as SysLoginLogController from './controller/SysLoginLogController.js'
import * as SysMenuController from './controller/SysMenuController.js'
import * as SysRoleController from './controller/SysRoleController.js'

import upload from '#utils/upload.js'

import Router from '@koa/router'

const router = new Router()

router.get('/base/captchaImage', CommonController.captchaAction)

router.post('/base/userLogin', SysUserController.loginAction)
router.post('/base/userLogout', SysUserController.logoutAction)

router.get('/base/userPermit', SysUserController.permitAction)
router.get('/base/userInfo', SysUserController.infoUserAction)
router.get('/base/userLoginLog', SysLoginLogController.listUserLoginLogAction)
router.post(
  '/base/modifyUserAvatar',
  upload().single('file'),
  SysUserController.modifyUserAvatarAction
)
router.post('/base/modifyUserInfo', SysUserController.modifyUserInfoAction)
router.post('/base/modifyUserPwd', SysUserController.modifyUserPwdAction)
router.post('/base/modifyUserSetting', SysUserController.modifyUserSettingAction)

router.post('/user/addUser', SysUserController.addUserAction)
router.post('/user/modifyUser', SysUserController.modifyUserAction)
router.post('/user/deleteUser', SysUserController.deleteUserAction)
router.get('/user/listUser', SysUserController.listUserAction)

router.get('/user/listOnlineUser', SysLoginLogController.listOnlineUserAction)
router.post('/user/deleteOnlineUser', SysLoginLogController.deleteOnlineUserAction)

router.get('/menu/listMenu', SysMenuController.listMenuAction)
router.get('/menu/listSimpleMenu', SysMenuController.listSimpleMenuAction)
router.post('/menu/addMenu', SysMenuController.addMenuAction)
router.post('/menu/modifyMenu', SysMenuController.modifyMenuAction)
router.post('/menu/deleteMenu', SysMenuController.deleteMenuAction)
router.post('/menu/modifyMenuOrder', SysMenuController.modifyMenuOrderAction)

router.get('/log/listLoginLog', SysLoginLogController.listLoginLogAction)

router.get('/role/listRole', SysRoleController.listRoleAction)
router.get('/role/listSimpleRole', SysRoleController.listSimpleRoleAction)
router.post('/role/addRole', SysRoleController.addRoleAction)
router.post('/role/modifyRole', SysRoleController.modifyRoleAction)
router.post('/role/deleteRole', SysRoleController.deleteRoleAction)

export default router
