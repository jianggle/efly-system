import glob from 'glob'
import path from 'path'
import { fileURLToPath } from 'url'
import Router from '@koa/router'
import { authMiddleware } from '#middleware/auth-middleware.js'

const router = new Router({
  prefix: '/manage-api',
})

router.use(
  authMiddleware({
    unlessToken: [/^\/manage-api\/base\/(captchaImage|userLogin|userLogout)$/],
    unlessPermit: [/^\/manage-api\/base\//],
  })
)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const routerFiles = glob.sync(path.resolve(__dirname, './', '**/*-router.js'))
for (let item of routerFiles) {
  let res = await import('file:///' + item)
  router.use('', res.default.routes())
}

export default router
