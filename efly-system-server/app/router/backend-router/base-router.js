const Router = require('koa-router')
const router = new Router()
const CommonController = require('../../controller/common-controller')
const UserController = require('../../controller/user-controller')
const upload = require('../../utils/upload')

router.get('/base/captchaImage', CommonController.captchaAction)

router.post('/base/userLogin', UserController.loginAction)
router.post('/base/userLogout', UserController.logoutAction)

router.get('/base/userPermit', UserController.permitAction)
router.get('/base/userInfo', UserController.infoUserAction)
router.post('/base/modifyUserAvatar', upload().single('file'), UserController.modifyUserAvatarAction)
router.post('/base/modifyUserInfo', UserController.modifyUserInfoAction)
router.post('/base/modifyUserPwd', UserController.modifyUserPwdAction)
router.post('/base/modifyUserSetting', UserController.modifyUserSettingAction)

module.exports = router
