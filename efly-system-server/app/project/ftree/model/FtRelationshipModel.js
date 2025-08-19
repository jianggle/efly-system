import BaseModel from '#utils/db_orm.js'
import { dbTables } from '#config/index.js'

class FtRelationshipModel extends BaseModel {
  constructor() {
    super(dbTables.FT_RELATIONSHIP)
  }
}

export default new FtRelationshipModel()
