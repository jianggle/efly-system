const BaseModel = require('@app/utils/db_orm')
const { dbTables } = require('@app/config')

class MenuModel extends BaseModel {
  constructor() {
    super(dbTables.SYSTEM_MENU)
    this.defaultOrder = 'order_num ASC,menu_id ASC'
  }
}

module.exports = new MenuModel()
