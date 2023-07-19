import BaseModel  from '#utils/db_orm.js'
import { dbTables } from '#config/index.js'

class CmsCategoryModel extends BaseModel {
  constructor() {
    super(dbTables.CMS_CATEGORY)
  }

  async getList(isSimple = false) {
    const fixedItem = {
      sid: -1,
      pid: 0,
      sortname: '未分类',
      description: '系统保留',
      taxis: 0
    }
    let result = []

    if (isSimple) {
      result = await this.findAll({
        order: 'taxis ASC,sid DESC',
        attributes: ['sid', 'sortname', 'pid']
      })
    } else {
      const countSql = `SELECT sortid,count(*) AS count FROM ${dbTables.CMS_ARTICLE} group by sortid`
      result = await this.query(`SELECT * FROM ${this.table} a left join (${countSql}) b on a.sid=b.sortid`)
    }

    result.unshift(fixedItem)
    return result
  }
}

export default new CmsCategoryModel()
