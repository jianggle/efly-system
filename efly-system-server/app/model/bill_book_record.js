const BaseModel = require('@app/utils/db_orm')
const { dbTables } = require('@app/config')

class BillBookRecordModel extends BaseModel {
  constructor() {
    super(dbTables.BILL_BOOK_RECORD)
  }
}

module.exports = new BillBookRecordModel()
