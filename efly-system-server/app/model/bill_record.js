const BaseModel = require('@app/utils/db_orm')
const { dbTables } = require('@app/config')

class BillRecordModel extends BaseModel {
  constructor() {
    super(dbTables.BILL_RECORD)
  }

  getList({
    offset,
    limit,
    bookId,
    tradePlatform,
    tradeShouzhi,
    tradePos,
    timeStart,
    timeEnd,
  }) {
    const where = {}
    const whereArr = []

    if (tradePlatform) {
      where['trade_platform'] = tradePlatform
    }
    if (tradeShouzhi) {
      where['trade_shouzhi'] = tradeShouzhi
    }
    if (tradePos) {
      whereArr.push(`(trade_pos like '%${tradePos}%')`)
    }
    if (timeStart && timeEnd) {
      whereArr.push(`trade_time_create >= '${timeStart}'`)
      whereArr.push(`trade_time_create < '${timeEnd}'`)
    }
    if (bookId) {
      whereArr.push(`record_id in (SELECT record_id FROM ${dbTables.BILL_BOOK_RECORD} where book_id=${bookId})`)
    }
    if (whereArr.length) {
      where['+'] = whereArr.join(' and ')
    }

    return this.findAndCountAll({
      where,
      offset,
      limit,
      order: 'trade_time_create DESC'
    })
  }
}

module.exports = new BillRecordModel()
