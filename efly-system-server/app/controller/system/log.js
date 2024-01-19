import LogModel from '#model/sys_log_login.js'
import UserModel from '#model/sys_user.js'
import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess } from '#utils/resModel.js'

export const listUserLoginLogAction = async (ctx) => {
  const [offset, limit] = Validator.formatPagingParams(ctx)
  const userInfo = await UserModel.getOne(ctx.state.user.id)
  const result = await LogModel.getListByUserName(userInfo.userName, offset, limit)
  await responseSuccess(ctx, result)
}

export const listLoginLogAction = async (ctx) => {
  let { status, keyword, timeRange = '' } = ctx.request.query
  const [offset, limit] = Validator.formatPagingParams(ctx)
  const [timeStart, timeEnd] = Validator.formatTimeRange(timeRange)
  const result = await LogModel.getList({
    offset,
    limit,
    status,
    keyword,
    timeStart,
    timeEnd,
  })
  await responseSuccess(ctx, result)
}

export const listOnlineUserAction = async (ctx) => {
  let { ipaddr, userName } = ctx.request.query
  const [offset, limit] = Validator.formatPagingParams(ctx)
  const result = await LogModel.getList({
    offset,
    limit,
    status: 0,
    keyword: userName,
    ipaddr,
    online: true,
  })
  await responseSuccess(ctx, result)
}

export const deleteOnlineUserAction = async (ctx) => {
  await ParamCheck.check(ctx.request.body, {
    token: new ParamCheck().isRequired(),
  })
  const { token } = ctx.request.body
  await LogModel.outTokenStatusBySelf(token)
  await responseSuccess(ctx)
}
