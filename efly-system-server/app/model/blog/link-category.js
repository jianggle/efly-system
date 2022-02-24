const TableModel = require('@app/model/table-model')
const { dbTables } = require('@app/config')

class BlogLinkCategoryModel extends TableModel {
  constructor() {
    super(dbTables.BLOG_LINK_CATEGORY)
  }

  async getCategories(isSimple = false) {
    if (isSimple) {
      return await this.findAll({
        order: {
          taxis: 'ASC',
          catid: 'DESC',
        },
        attributes: ['catid', 'catname']
      })
    } else {
      const countSql = `SELECT catid,count(*) AS count FROM ${dbTables.BLOG_LINK} group by catid`
      const fieldStr = 'a.catid,a.catname,a.taxis,a.description,count'
      const orderSql = 'order by a.taxis ASC,a.catid DESC'
      return await this.query(`SELECT ${fieldStr} FROM ${this.table} a left join (${countSql}) b on a.catid=b.catid ${orderSql}`)
    }
  }

  getOneCategory(params) {
    return this.findOne({
      where: params,
      attributes: ['catid', 'catname']
    })
  }

  updateCategory(catid, params) {
    return this.update(params, { catid })
  }

  removeCategory(catid) {
    return this.destroy({ catid })
  }
}

module.exports = new BlogLinkCategoryModel()
