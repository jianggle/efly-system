const CmsCategoryController = require('@app/controller/cms/category')
const CmsTagController = require('@app/controller/cms/tag')
const CmsArticleController = require('@app/controller/cms/article')
const CmsLinkCategoryController = require('@app/controller/cms/link-category')
const CmsLinkController = require('@app/controller/cms/link')

const Router = require('@koa/router')
const router = new Router()

const upload = require('@app/utils/upload')
router.post('/cms/uploadFile', upload().single('file'), CmsArticleController.uploadFileAction)

router.post('/cms/addCmsCategory', CmsCategoryController.addCmsCategoryAction)
router.post('/cms/modifyCmsCategory', CmsCategoryController.modifyCmsCategoryAction)
router.post('/cms/removeCmsCategory', CmsCategoryController.removeCmsCategoryAction)
router.get('/cms/listCmsCategory', CmsCategoryController.listCmsCategoryAction)
router.post('/cms/orderCmsCategory', CmsCategoryController.orderCmsCategoryAction)

router.post('/cms/addCmsTag', CmsTagController.addCmsTagAction)
router.post('/cms/modifyCmsTag', CmsTagController.modifyCmsTagAction)
router.post('/cms/removeCmsTag', CmsTagController.removeCmsTagAction)
router.get('/cms/listCmsTag', CmsTagController.listCmsTagAction)

router.post('/cms/addCmsArticle', CmsArticleController.addCmsArticleAction)
router.post('/cms/modifyCmsArticle', CmsArticleController.modifyCmsArticleAction)
router.get('/cms/listCmsArticle', CmsArticleController.listCmsArticleAction)
router.post('/cms/updateCmsArticleStatus', CmsArticleController.updateCmsArticleStatusAction)
router.post('/cms/batchOperateCmsArticle', CmsArticleController.batchOperateCmsArticleAction)
router.get('/cms/infoCmsArticle', CmsArticleController.infoCmsArticleAction)

router.post('/cms/addCmsLinkCategory', CmsLinkCategoryController.addCmsLinkCategoryAction)
router.post('/cms/modifyCmsLinkCategory', CmsLinkCategoryController.modifyCmsLinkCategoryAction)
router.post('/cms/removeCmsLinkCategory', CmsLinkCategoryController.removeCmsLinkCategoryAction)
router.get('/cms/listCmsLinkCategory', CmsLinkCategoryController.listCmsLinkCategoryAction)
router.post('/cms/orderCmsLinkCategory', CmsLinkCategoryController.orderCmsLinkCategoryAction)

router.post('/cms/addCmsLink', CmsLinkController.addCmsLinkAction)
router.post('/cms/modifyCmsLink', CmsLinkController.modifyCmsLinkAction)
router.get('/cms/listCmsLink', CmsLinkController.listCmsLinkAction)
router.post('/cms/updateCmsLinkStatus', CmsLinkController.updateCmsLinkStatusAction)
router.post('/cms/orderCmsLink', CmsLinkController.orderCmsLinkAction)
router.post('/cms/batchOperateCmsLink', CmsLinkController.batchOperateCmsLinkAction)

module.exports = router
