const { SignCategoryModel, SignRecordModel } = require('@app/model/mp_sign')
const { CustomException } = require('@app/utils/custom-exception')
const Validator = require('@app/utils/validator')
const Moment = require('moment')

const checkSelfCategory = async (catId, userId) => {
  const catInfo = await SignCategoryModel.findOne({ where: { catId } })
  if (!catInfo || catInfo.userId !== userId) {
    throw new CustomException(`越界啦，小伙`)
  }
  return catInfo
}

const editSignCategoryAction = async (ctx) => {
  let {
    catId,
    catName = '',
    catMode,
    startMonth,
  } = ctx.request.body

  if (!catName) {
    throw new CustomException('名称不能为空')
  }

  const isUpdate = Validator.isModify(ctx, 'catId')
  const userId = ctx.state.user.id

  const existItem = await SignCategoryModel.findOne({ where: { catName, userId } })
  if (existItem && (!isUpdate || existItem.catId !== catId)) {
    throw new CustomException(`名称已存在`)
  }

  const params = {
    catName,
    catMode,
    startMonth: new Date(new Date(startMonth).setHours(0, 0, 0, 0)),
  }

  if (isUpdate) {
    await checkSelfCategory(catId, userId)
    await SignCategoryModel.update(params, { catId })
  } else {
    params.userId = userId
    await SignCategoryModel.create(params)
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

const listSignCategoryAction = async (ctx) => {
  const userId = ctx.state.user.id
  const result = await SignCategoryModel.findAll({ where: { userId } })
  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

const detailSignCategoryAction = async (ctx) => {
  const { catId } = ctx.request.body
  if (!Validator.isPositiveInteger(catId)) {
    throw new CustomException('catId不合法')
  }

  const result = await checkSelfCategory(catId, ctx.state.user.id)

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

const deleteSignCategoryAction = async (ctx) => {
  const { catId } = ctx.request.body
  if (!Validator.isPositiveInteger(catId)) {
    throw new CustomException('参数不合法')
  }

  await checkSelfCategory(catId, ctx.state.user.id)
  await SignCategoryModel.destroy({ catId })
  await SignRecordModel.destroy({ catId })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

const addSignRecordAction = async (ctx) => {
  const { catId, remark, signTime } = ctx.request.body
  const realSignTime = signTime === 'now' ? new Date() : new Date(signTime)
  if (!Validator.isPositiveInteger(catId)) {
    throw new CustomException('参数不合法')
  }

  const catInfo = await checkSelfCategory(catId, ctx.state.user.id)
  const existItem = await SignRecordModel.findOne({
    where: {
      catId: catId,
      '+': `DATE_FORMAT(sign_time,'%Y-%m-%d') = '${Moment(realSignTime).format('YYYY-MM-DD')}'`,
    }
  })
  if (existItem) {
    throw new CustomException('已有重复记录')
  }

  await SignRecordModel.create({
    signTime: realSignTime,
    catId: catId,
    remark,
    updateTime: signTime === 'now' ? null : new Date()
  })

  const continueDays = await SignRecordModel.getContinueDays(catId)
  const latestTime = new Date(catInfo.latestTime) > realSignTime ? new Date(catInfo.latestTime) : realSignTime
  await SignCategoryModel.update({
    nums: catInfo.nums + 1,
    days: continueDays,
    latestTime: latestTime,
  }, {
    catId: catId
  })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

const listMonthSignRecordAction = async (ctx) => {
  const { time, catId } = ctx.request.body
  if (!Validator.isPositiveInteger(catId)) {
    throw new CustomException('参数不合法')
  }

  const catInfo = await checkSelfCategory(catId, ctx.state.user.id)
  const result = await SignRecordModel.findAll({
    where: {
      catId: catId,
      '+': `DATE_FORMAT(sign_time,'%Y-%m') = '${Moment(new Date(time)).format('YYYY-MM')}'`
    }
  })

  const latestTime = Moment(catInfo.latestTime).format('YYYY-MM-DD')
  const todayTime = Moment(new Date()).format('YYYY-MM-DD')

  const lastRes = Object.assign({}, catInfo, {
    isSignedToday: latestTime === todayTime,
    signed: result.map(item => {
      return {
        id: item.signId,
        day: Moment(item.signTime).format('DD') * 1,
        remark: item.remark
      }
    })
  })

  ctx.body = {
    code: 0,
    msg: 'success',
    data: lastRes
  }
}

const listSignRecordAction = async (ctx) => {
  const { catId } = ctx.request.body
  if (!Validator.isPositiveInteger(catId)) {
    throw new CustomException('参数不合法')
  }
  const [offset, limit] = Validator.formatPagingParams(ctx)

  await checkSelfCategory(catId, ctx.state.user.id)
  const result = await SignRecordModel.findAndCountAll({
    where: {
      catId: catId
    },
    order: 'sign_time DESC',
    offset,
    limit,
  })

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

const editSignRemarkAction = async (ctx) => {
  const { id, remark } = ctx.request.body
  if (!Validator.isPositiveInteger(id)) {
    throw new CustomException('参数不合法')
  }

  await SignRecordModel.update({
    remark: (remark || '').trim(),
    updateTime: new Date()
  }, {
    signId: id
  })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

const deleteSignRecordAction = async (ctx) => {
  const { id, catId } = ctx.request.body
  if (!Validator.isPositiveInteger(id) || !Validator.isPositiveInteger(catId)) {
    throw new CustomException('参数不合法')
  }

  const catInfo = await checkSelfCategory(catId, ctx.state.user.id)
  await SignRecordModel.destroy({ signId: id })
  const latestRecord = await SignRecordModel.findOne({
    where: { catId },
    order: 'sign_time DESC'
  })

  const continueDays = await SignRecordModel.getContinueDays(catId)
  await SignCategoryModel.update({
    nums: catInfo.nums - 1,
    days: continueDays,
    latestTime: latestRecord ? new Date(latestRecord.signTime) : null,
  }, {
    catId: catId
  })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

const resetSignDataAction = async (ctx) => {
  const userId = ctx.state.user.id
  const userCatgory = await SignCategoryModel.findAll({ where: { userId } })
  for (const item of userCatgory) {
    await SignRecordModel.destroy({ catId: item.catId })
  }
  await SignCategoryModel.destroy({ userId })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

module.exports = {
  editSignCategoryAction,
  listSignCategoryAction,
  detailSignCategoryAction,
  deleteSignCategoryAction,

  addSignRecordAction,
  listMonthSignRecordAction,

  listSignRecordAction,
  editSignRemarkAction,
  deleteSignRecordAction,

  resetSignDataAction,
}
