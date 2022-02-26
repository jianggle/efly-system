const BlogArticleController = require('@app/controller/blog/article')
const BlogLinkController = require('@app/controller/blog/link')

const router = require('koa-router')({
  prefix: '/frontend-api'
})

router.get('/blog/listArticle', BlogArticleController.listBlogArticleAction)
router.get('/blog/infoArticle', BlogArticleController.infoBlogArticleAction)
router.get('/blog/listLinkAll', BlogLinkController.listLinkAllAction)

module.exports = router
