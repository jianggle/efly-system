const MpMemberModel = require('@app/model/mp_member')
const { CustomException } = require('@app/utils/custom-exception')
const { getUserIp } = require('@app/utils')
const { authMpLogin } = require('@app/utils/auth')
const { mpInfo } = require('@app/config')
const axios = require('axios').default

const memberLoginAction = async (ctx) => {
  const { code, mpScene } = ctx.request.query
  const currentMp = mpInfo[mpScene]
  if (!currentMp) {
    throw new CustomException('非法调用')
  }

  const { data: { openid, session_key } } = await axios({
    method: 'get',
    url: 'https://api.weixin.qq.com/sns/jscode2session',
    params: {
      appid: currentMp.appid,
      secret: currentMp.secret,
      js_code: code,
      grant_type: 'authorization_code',
    }
  })

  const existItem = await MpMemberModel.findOne({ where: { openid } })
  if (existItem && existItem.delFlag !== 0) {
    throw new CustomException('账号已注销')
  }
  if (existItem && existItem.status !== 0) {
    throw new CustomException('账号未启用')
  }

  let userId = null
  const params = {
    loginDate: new Date(),
    loginIp: getUserIp(ctx.request),
  }
  if (existItem) {
    userId = existItem.id
    await MpMemberModel.update(params, { id: existItem.id })
  } else {
    ({
      insertId: userId
    } = await MpMemberModel.create({
      appid: currentMp.appid,
      openid,
      ...params
    }))
  }

  const token = authMpLogin({ id: userId })

  ctx.body = {
    code: 0,
    msg: 'success',
    data: token
  }
}

module.exports = {
  memberLoginAction
}
