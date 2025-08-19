import BaseModel from '#utils/db_orm.js'
import { dbTables } from '#config/index.js'

class FtPersonModel extends BaseModel {
  constructor() {
    super(dbTables.FT_PERSON)
  }
}

export default new FtPersonModel()
