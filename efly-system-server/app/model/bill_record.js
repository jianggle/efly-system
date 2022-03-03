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
    trade_platform,
    trade_shouzhi,
    trade_pos,
    time_start,
    time_end,
  }) {
    const where = {}
    const whereArr = []

    if (trade_platform) {
      where['trade_platform'] = trade_platform
    }
    if (trade_shouzhi) {
      where['trade_shouzhi'] = trade_shouzhi
    }
    if (trade_pos) {
      whereArr.push(`(trade_pos like '%${trade_pos}%')`)
    }
    if (time_start && time_end) {
      whereArr.push(`trade_time_create >= '${time_start}'`)
      whereArr.push(`trade_time_create < '${time_end}'`)
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
