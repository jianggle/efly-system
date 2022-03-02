const TableModel = require('@app/model/table-model')
const { dbTables } = require('@app/config')

class BillBookRecordModel extends TableModel {
  constructor() {
    super(dbTables.BILL_BOOK_RECORD)
  }
}

module.exports = new BillBookRecordModel()
