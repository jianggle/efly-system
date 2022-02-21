const svgCaptcha = require('svg-captcha')
const { redis } = require('@app/utils/redis')
const { v4: uuidv4 } = require('uuid')
const { captchaExpire } = require('@app/config')

// https://github.com/produck/svg-captcha/blob/HEAD/README_CN.md
exports.captchaAction = async (ctx) => {
  const captcha = svgCaptcha.create({
    size: 4,
    ignoreChars: '0o1il',
    fontSize: 36,
    width: 120,
    height: 36,
    // noise: Math.floor(Math.random() * 5),
    // color: true,
    // background: '#ccc',
  })

  // ctx.response.type = 'image/svg+xml'
  // ctx.body = captcha.data

  const uuid = 'cpt' + uuidv4()
  await redis.set(uuid, captcha.text.toLowerCase(), 'EX', captchaExpire)

  ctx.body = {
    code: 0,
    msg: 'success',
    data: {
      id: uuid,
      image: captcha.data,
    }
  }
}
