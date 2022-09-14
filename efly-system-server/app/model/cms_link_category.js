const BaseModel = require('@app/utils/db_orm')
const { dbTables } = require('@app/config')

class CmsLinkCategoryModel extends BaseModel {
  constructor() {
    super(dbTables.CMS_LINK_CATEGORY)
  }

  async getList(isSimple = false) {
    if (isSimple) {
      return await this.findAll({
        order: 'taxis ASC,catid DESC',
        attributes: ['catid', 'catname']
      })
    } else {
      const countSql = `SELECT catid,count(*) AS count FROM ${dbTables.CMS_LINK} group by catid`
      const fieldStr = 'a.catid,a.catname,a.taxis,a.description,count'
      const orderSql = 'order by a.taxis ASC,a.catid DESC'
      return await this.query(`SELECT ${fieldStr} FROM ${this.table} a left join (${countSql}) b on a.catid=b.catid ${orderSql}`)
    }
  }
}

module.exports = new CmsLinkCategoryModel()
