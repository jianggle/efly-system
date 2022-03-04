const BaseModel = require('@app/utils/db_orm')

class MpMemberModel extends BaseModel {
  constructor() {
    super('mp_member')
  }
}

module.exports = new MpMemberModel()
