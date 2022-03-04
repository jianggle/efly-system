const MemberController = require('@app/controller/mp/member')
const SignController = require('@app/controller/mp/sign')

const authMp = require('@app/middleware/auth-mp')
const router = require('@koa/router')({
  prefix: '/mp'
})
router.use(authMp({
  unless: [
    /^\/mp\/member\/memberWXLogin$/,
  ]
}))

router.get('/member/memberWXLogin', MemberController.memberLoginAction)

router.post('/sign/editSignCategory', SignController.editSignCategoryAction)
router.post('/sign/listSignCategory', SignController.listSignCategoryAction)
router.post('/sign/detailSignCategory', SignController.detailSignCategoryAction)
router.post('/sign/deleteSignCategory', SignController.deleteSignCategoryAction)

router.post('/sign/addSignRecord', SignController.addSignRecordAction)
router.post('/sign/listMonthSignRecord', SignController.listMonthSignRecordAction)

router.post('/sign/listSignRecord', SignController.listSignRecordAction)
router.post('/sign/editSignRemark', SignController.editSignRemarkAction)
router.post('/sign/deleteSignRecord', SignController.deleteSignRecordAction)

module.exports = router
