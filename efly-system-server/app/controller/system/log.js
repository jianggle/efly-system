const LogModel = require('@app/model/sys_log_login')
const UserModel = require('@app/model/sys_user')
const ParamCheck = require('@app/utils/paramCheck')
const Validator = require('@app/utils/validator')
const { responseSuccess } = require('@app/utils/resModel')

exports.listUserLoginLogAction = async (ctx) => {
  const [offset, limit] = Validator.formatPagingParams(ctx)
  const userInfo = await UserModel.getOne(ctx.state.user.id)
  const result = await LogModel.getListByUserName(userInfo.userName, offset, limit)
  await responseSuccess(ctx, result)
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
  await responseSuccess(ctx, result)
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
  await responseSuccess(ctx, result)
}

exports.deleteOnlineUserAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    token: new ParamCheck().isRequired()
  })
  const { token } = ctx.request.body
  await LogModel.outTokenStatusBySelf(token)
  await responseSuccess(ctx)
}
