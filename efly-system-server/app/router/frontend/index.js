const FrontendController = require('@app/controller/frontend')

const Router = require('koa-router')
const router = new Router()

router.get('/', (ctx) => {
  ctx.redirect('/blog')
})
router.get('/blog', FrontendController.listArticleAction)
router.get('/blog/article/:id.html', FrontendController.infoArticleAction)
router.get('/blog/link.html', FrontendController.listLinkAllAction)

module.exports = router
