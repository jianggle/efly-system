const LogModel = require('../model/log-model')
const UserModel = require('../model/user-model')

const Validator = require('../utils/validator')
const Moment = require('moment')

exports.listUserLoginLogAction = async (ctx) => {
  const [offset, limit] = Validator.formatPagingParams(ctx)
  const userInfo = await UserModel.getUserById(ctx.state.userId)
  const result = await LogModel.getLoginLogByUserName(userInfo.userName, offset, limit)
  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

exports.listLoginLogAction = async (ctx) => {
  let {
    status,
    keyword,
    time_start,
    time_end
  } = ctx.request.query
  const [offset, limit] = Validator.formatPagingParams(ctx)

  time_start = time_start ? Moment(Number(time_start)).format('YYYY-MM-DD HH:mm:ss') : null
  time_end = time_end ? Moment(Number(time_end)).format('YYYY-MM-DD HH:mm:ss') : null
  const result = await LogModel.getLoginLogs(offset, limit, status, keyword, time_start, time_end)

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

exports.resetLoginLogAction = async (ctx) => {
  await LogModel.clearLoginLog()
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
