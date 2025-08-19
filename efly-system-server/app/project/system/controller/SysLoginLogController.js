import SysLoginLogModel from '../model/SysLoginLogModel.js'
import SysUserModel from '../model/SysUserModel.js'

import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess } from '#utils/resModel.js'

export const listUserLoginLogAction = async (ctx) => {
  const [offset, limit] = Validator.formatPagingParams(ctx)
  const userInfo = await SysUserModel.getOne(ctx.state.user.id)
  const result = await SysLoginLogModel.getListByUserName(userInfo.userName, offset, limit)
  await responseSuccess(ctx, result)
}

export const listLoginLogAction = async (ctx) => {
  let { status, keyword, timeRange = '' } = ctx.request.query
  const [offset, limit] = Validator.formatPagingParams(ctx)
  const [timeStart, timeEnd] = Validator.formatTimeRange(timeRange)
  const result = await SysLoginLogModel.getList({
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
  const result = await SysLoginLogModel.getList({
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
  await SysLoginLogModel.outTokenStatusBySelf(token)
  await responseSuccess(ctx)
}
