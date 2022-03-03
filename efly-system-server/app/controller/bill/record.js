const BillRecordModel = require('@app/model/bill_record')

const Validator = require('@app/utils/validator')
const Moment = require('moment')
const { CustomException } = require('@app/utils/custom-exception')

const fs = require('fs')
const path = require('path')
const iconv = require('iconv-lite')

exports.listBillRecordAction = async (ctx) => {
  let {
    bookId,
    tradePlatform = '',
    tradeShouzhi = '',
    tradePos = '',
    timeRange = '',
  } = ctx.request.query

  bookId = bookId * 1 || null
  if (tradePlatform && !['alipay', 'wechat'].includes(tradePlatform)) {
    throw new CustomException('tradePlatform不合法')
  }
  if (tradeShouzhi && !['支出', '收入'].includes(tradeShouzhi)) {
    throw new CustomException('tradeShouzhi不合法')
  }
  tradePos = (tradePos || '').trim()
  let [time_start, time_end] = timeRange.split(',')
  if (time_start && time_end) {
    time_start = Moment(Number(time_start)).format('YYYY-MM-DD HH:mm:ss')
    time_end = Moment(Number(time_end)).format('YYYY-MM-DD HH:mm:ss')
  } else {
    time_start = time_end = null
  }

  const [offset, limit] = Validator.formatPagingParams(ctx)
  const result = await BillRecordModel.getList({
    offset,
    limit,
    bookId,
    trade_platform: tradePlatform,
    trade_shouzhi: tradeShouzhi,
    trade_pos: tradePos,
    time_start,
    time_end
  })

  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

exports.importBillRecordAction = async (ctx) => {
  const { importOrigin } = ctx.request.body

  // 获取临时路径
  const localPath = ctx.file.path
  // 校验文件合法性
  if (path.extname(ctx.file.filename).toLowerCase() !== '.csv') {
    // 删除临时文件
    fs.unlinkSync(localPath)
    throw new CustomException('仅支持csv文件')
  }

  try {
    const resBuffer = fs.readFileSync(localPath)
    const fileCode = {
      'alipay': 'gb2312',
      'wechat': 'utf8',
    } [importOrigin]
    const resStr = iconv.decode(resBuffer, fileCode)
    const rows = resStr.split('\r\n')

    let num_valid = 0, num_invalid = 0, num_repeat = 0;
    for (let row of rows) {
      let trade_no_platform,
        trade_no_pos,
        trade_time_create,
        trade_time_pay,
        trade_time_update,
        trade_pos,
        trade_goods,
        trade_shouzhi,
        trade_money,
        trade_status,
        trade_type,
        trade_pay_type,
        trade_fee,
        trade_refund,
        trade_money_status,
        trade_origin,
        trade_remarks;

      if (importOrigin === 'wechat') {
        [
          trade_time_create,
          trade_type,
          trade_pos,
          trade_goods,
          trade_shouzhi,
          trade_money,
          trade_pay_type,
          trade_status,
          trade_no_platform,
          trade_no_pos,
          trade_remarks,
        ] = row.split(',').map(item2 => {
          return (item2 || '').replace(/^"|"$|\t/g, '')
        })

        if (!trade_time_create || !trade_no_platform || trade_time_create === '交易时间' || trade_no_platform === '交易单号') {
          num_invalid += 1
          continue
        }

      } else if (importOrigin === 'alipay') {
        [
          trade_no_platform,
          trade_no_pos,
          trade_time_create,
          trade_time_pay,
          trade_time_update,
          trade_origin,
          trade_type,
          trade_pos,
          trade_goods,
          trade_money,
          trade_shouzhi,
          trade_status,
          trade_fee,
          trade_refund,
          trade_remarks,
          trade_money_status,
        ] = row.split(',').map(item2 => {
          return (item2 || '').replace(/^"|"$|\t|^\s*|\s*$/g, '')
        })

        if (!trade_time_create || !trade_no_platform || trade_time_create === '交易创建时间' || trade_no_platform === '交易号') {
          num_invalid += 1
          continue
        }
      }

      let trade_platform = importOrigin
      trade_time_pay = trade_time_pay || null
      trade_time_update = trade_time_update || null
      let existItem = await BillRecordModel.findOne({
        where: {
          trade_platform,
          trade_time_create,
          trade_no_platform,
        }
      })
      if (existItem) {
        num_repeat += 1
        continue
      }

      await BillRecordModel.create({
        trade_platform,
        trade_no_platform,
        trade_no_pos,
        trade_time_create,
        trade_time_pay,
        trade_time_update,
        trade_pos,
        trade_goods,
        trade_shouzhi,
        trade_money: trade_money.replace(/¥|,/g, ''),
        trade_status,
        trade_type,
        trade_pay_type,
        trade_fee,
        trade_refund,
        trade_money_status,
        trade_origin,
        trade_remarks
      })
      num_valid += 1
    }

    fs.unlinkSync(localPath)
    ctx.body = {
      code: 0,
      msg: 'success',
      data: `成功 ${num_valid} 条，舍弃无效数据 ${num_invalid} 条，舍弃重复数据 ${num_repeat} 条`
    }
  } catch (error) {
    fs.unlinkSync(localPath)
    throw error
  }
}
