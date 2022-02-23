const BlogCategoryController = require('@app/controller/blog/category')
const BlogTagController = require('@app/controller/blog/tag')
const BlogArticleController = require('@app/controller/blog/article')

const Router = require('koa-router')
const router = new Router()

router.post('/blog/addBlogCategory', BlogCategoryController.addBlogCategoryAction)
router.post('/blog/modifyBlogCategory', BlogCategoryController.modifyBlogCategoryAction)
router.post('/blog/removeBlogCategory', BlogCategoryController.removeBlogCategoryAction)
router.get('/blog/listBlogCategory', BlogCategoryController.listBlogCategoryAction)
router.post('/blog/orderBlogCategory', BlogCategoryController.orderBlogCategoryAction)

router.post('/blog/addBlogTag', BlogTagController.addBlogTagAction)
router.post('/blog/modifyBlogTag', BlogTagController.modifyBlogTagAction)
router.post('/blog/removeBlogTag', BlogTagController.removeBlogTagAction)
router.get('/blog/listBlogTag', BlogTagController.listBlogTagAction)

router.post('/blog/addBlogArticle', BlogArticleController.addBlogArticleAction)
router.post('/blog/modifyBlogArticle', BlogArticleController.modifyBlogArticleAction)
router.get('/blog/listBlogArticle', BlogArticleController.listBlogArticleAction)
router.post('/blog/updateBlogArticleStatus', BlogArticleController.updateBlogArticleStatusAction)
router.post('/blog/batchOperateBlogArticle', BlogArticleController.batchOperateBlogArticleAction)
router.get('/blog/infoBlogArticle', BlogArticleController.infoBlogArticleAction)

module.exports = router
