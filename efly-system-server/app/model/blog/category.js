const TableModel = require('@app/model/table-model')
const { dbTables } = require('@app/config')

class BlogCategoryModel extends TableModel {
  constructor() {
    super(dbTables.BLOG_CATEGORY)
  }

  async getCategories(isSimple = false) {
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
        order: {
          taxis: 'ASC',
          sid: 'DESC',
        },
        attributes: ['sid', 'sortname', 'pid']
      })
    } else {
      const countSql = `SELECT sortid,count(*) AS count FROM ${dbTables.BLOG_ARTICLE} group by sortid`
      result = await this.query(`SELECT * FROM ${this.table} a left join (${countSql}) b on a.sid=b.sortid`)
    }

    result.unshift(fixedItem)
    return result
  }

  getOneCategory(params) {
    return this.findOne({
      where: params,
      attributes: ['sid', 'sortname', 'alias']
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
