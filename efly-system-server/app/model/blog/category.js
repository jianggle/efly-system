const TableModel = require('@app/model/table-model')
const { dbTables } = require('@app/config')

class BlogCategoryModel extends TableModel {
  constructor() {
    super(dbTables.BLOG_CATEGORY)
  }

  getCategories(isSimple = false) {
    if (isSimple) {
      return this.findAll({
        order: {
          taxis: 'ASC',
          sid: 'DESC',
        },
        attributes: ['sid', 'sortname', 'pid']
      })
    }
    const countSql = `SELECT sortid,count(*) AS count FROM ${dbTables.BLOG_ARTICLE} group by sortid`
    return this.query(`SELECT * FROM ${this.table} a left join (${countSql}) b on a.sid=b.sortid`)
  }

  selectRepeat(sortname, alias) {
    return this.findOne({
      where: {
        '+': `sortname='${sortname}'` + (alias ? ` or alias='${alias}'` : '')
      }
    })
  }

  updateCategory(sid, params) {
    return this.update(params, { sid })
  }

  removeCategory(sid) {
    return this.destroy({ sid })
  }
}

module.exports = new BlogCategoryModel()
