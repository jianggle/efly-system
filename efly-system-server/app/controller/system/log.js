const LogModel = require('@app/model/sys_log_login')
const UserModel = require('@app/model/sys_user')

const Validator = require('@app/utils/validator')
const Moment = require('moment')

exports.listUserLoginLogAction = async (ctx) => {
  const [offset, limit] = Validator.formatPagingParams(ctx)
  const userInfo = await UserModel.getOne(ctx.state.userId)
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
    time_start,
    time_end
  } = ctx.request.query
  const [offset, limit] = Validator.formatPagingParams(ctx)

  time_start = time_start ? Moment(Number(time_start)).format('YYYY-MM-DD HH:mm:ss') : null
  time_end = time_end ? Moment(Number(time_end)).format('YYYY-MM-DD HH:mm:ss') : null
  const result = await LogModel.getList({
    offset,
    limit,
    status,
    keyword,
    time_start,
    time_end
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
