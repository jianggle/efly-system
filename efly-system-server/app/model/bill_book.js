const BaseModel = require('@app/utils/db_orm')
const { dbTables } = require('@app/config')

class BillBookModel extends BaseModel {
  constructor() {
    super(dbTables.BILL_BOOK)
  }
}

module.exports = new BillBookModel()
