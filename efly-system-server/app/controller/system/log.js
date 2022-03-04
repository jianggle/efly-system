const LogModel = require('@app/model/sys_log_login')
const UserModel = require('@app/model/sys_user')

const Validator = require('@app/utils/validator')

exports.listUserLoginLogAction = async (ctx) => {
  const [offset, limit] = Validator.formatPagingParams(ctx)
  const userInfo = await UserModel.getOne(ctx.state.user.id)
  const result = await LogModel.getListByUserName(userInfo.userName, offset, limit)
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
    timeRange = '',
  } = ctx.request.query

  const [offset, limit] = Validator.formatPagingParams(ctx)
  const [timeStart, timeEnd] = Validator.formatTimeRange(timeRange)

  const result = await LogModel.getList({
    offset,
    limit,
    status,
    keyword,
    timeStart,
    timeEnd
  })

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

exports.listOnlineUserAction = async (ctx) => {
  let {
    ipaddr,
    userName,
  } = ctx.request.query

  const [offset, limit] = Validator.formatPagingParams(ctx)
  const result = await LogModel.getList({
    offset,
    limit,
    status: 0,
    keyword: userName,
    ipaddr,
    online: true
  })

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

exports.deleteOnlineUserAction = async (ctx) => {
  let { token } = ctx.request.body
  await LogModel.outTokenStatusBySelf(token)
  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
