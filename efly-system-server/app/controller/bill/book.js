const BillBookModel = require('@app/model/bill_book')
const BillBookRecordModel = require('@app/model/bill_book_record')
const BillRecordModel = require('@app/model/bill_record')

const Validator = require('@app/utils/validator')
const { CustomException } = require('@app/utils/custom-exception')

exports.listBillBookAction = async (ctx) => {
  const result = await BillBookModel.findAll({
    order: 'book_id DESC'
  })
  ctx.body = {
    code: 0,
    msg: 'success',
    data: result
  }
}

const handleEditBillBook = async (ctx) => {
  let {
    bookId,
    bookName = '',
    bookRemarks = ''
  } = ctx.request.body

  if (!bookName) {
    throw new CustomException('bookName不合法')
  }
  const isUpdate = Validator.isModify(ctx, 'bookId')

  const existItem = await BillBookModel.findOne({
    where: { bookName }
  })
  if (existItem && (!isUpdate || existItem.bookId !== bookId)) {
    throw new CustomException(`名称已存在`)
  }

  const params = {
    bookName,
    bookRemarks,
  }

  if (isUpdate) {
    BillBookModel.update(params, { bookId })
  } else {
    await BillBookModel.create(params)
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.addBillBookAction = (ctx) => {
  return handleEditBillBook(ctx)
}

exports.modifyBillBookAction = (ctx) => {
  return handleEditBillBook(ctx)
}

exports.removeBillBookAction = async (ctx) => {
  const { bookId } = ctx.request.body
  if (!Validator.isPositiveInteger(bookId)) {
    throw new CustomException('bookId不合法')
  }

  await BillBookModel.destroy({ bookId })
  await BillBookRecordModel.destroy({ bookId })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.countBillBookAction = async (ctx) => {
  const { bookId } = ctx.request.body
  if (!Validator.isPositiveInteger(bookId)) {
    throw new CustomException('bookId不合法')
  }

  const result = await BillRecordModel.findAll({
    attributes: ['trade_shouzhi', 'trade_money'],
    where: {
      '+': `record_id in (SELECT record_id FROM ${BillBookRecordModel.table} where book_id=${bookId})`
    }
  })

  let bookExpenditure = 0, bookIncome = 0
  result.forEach(item => {
    if (item.tradeShouzhi === '支出') {
      bookExpenditure += item.tradeMoney
    } else if (item.tradeShouzhi === '收入') {
      bookIncome += item.tradeMoney
    }
  })

  const resCount = {
    bookExpenditure: bookExpenditure.toFixed(2),
    bookIncome: bookIncome.toFixed(2),
  }

  await BillBookModel.update(resCount, { bookId })

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}

exports.batchRecordToBookAction = async (ctx) => {
  const { bookId, ids } = ctx.request.body

  if (!Validator.isPositiveInteger(bookId)) {
    throw new CustomException('bookId不合法')
  }
  if (!/^[1-9]\d*(,[1-9]\d*)*$/.test(ids)) {
    throw new CustomException('ids不合法')
  }

  const idsArr = ids.split(',')
  let numValid = 0, numRepeat = 0
  for (const recordId of idsArr) {
    const params = { bookId, recordId }
    const existItem = BillBookRecordModel.findOne({ where: params })
    if (existItem) {
      numRepeat += 1
    } else {
      await BillBookRecordModel.create(params)
      numValid += 1
    }
  }

  ctx.body = {
    code: 0,
    msg: 'success',
    data: `成功录入 ${numValid} 条，舍弃重复录入 ${numRepeat} 条`
  }
}

exports.removeBillBookRecordAction = async (ctx) => {
  const { bookId, ids } = ctx.request.body

  const idsArr = ids.split(',')

  for (const recordId of idsArr) {
    await BillBookRecordModel.destroy({ bookId, recordId })
  }

  ctx.body = {
    code: 0,
    msg: 'success'
  }
}
