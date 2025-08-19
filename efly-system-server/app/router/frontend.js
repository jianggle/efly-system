import * as FrontendController from '#project/FrontendController.js'

import Router from '@koa/router'

const router = new Router()

router.get('/', (ctx) => {
  ctx.redirect('/blog')
})
router.get('/blog', FrontendController.listArticleAction)
router.get('/blog/article/:id.html', FrontendController.infoArticleAction)
router.get('/blog/link.html', FrontendController.listLinkAllAction)

export default router
