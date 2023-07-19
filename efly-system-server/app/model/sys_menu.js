import BaseModel  from '#utils/db_orm.js'
import { dbTables } from '#config/index.js'

class MenuModel extends BaseModel {
  constructor() {
    super(dbTables.SYSTEM_MENU)
    this.defaultOrder = 'order_num ASC,menu_id ASC'
  }
}

export default new MenuModel()
