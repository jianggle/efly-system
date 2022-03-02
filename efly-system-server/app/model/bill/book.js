const TableModel = require('@app/model/table-model')
const { dbTables } = require('@app/config')

class BillBookModel extends TableModel {
  constructor() {
    super(dbTables.BILL_BOOK)
  }
}

module.exports = new BillBookModel()
