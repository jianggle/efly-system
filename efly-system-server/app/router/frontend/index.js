const BlogArticleController = require('@app/controller/blog/article')

const router = require('koa-router')({
  prefix: '/frontend-api'
})

router.get('/blog/listArticle', BlogArticleController.listBlogArticleAction)
router.get('/blog/infoArticle', BlogArticleController.infoBlogArticleAction)

module.exports = router
