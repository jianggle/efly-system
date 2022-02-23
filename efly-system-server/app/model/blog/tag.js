const TableModel = require('@app/model/table-model')
const { dbTables } = require('@app/config')

class BlogTagModel extends TableModel {
  constructor() {
    super(dbTables.BLOG_TAG)
  }

  getTags(isPopular = false, keyword = '') {
    const orderArr = ['a.tid DESC']
    if (isPopular) {
      orderArr.unshift('count DESC')
    }

    let whereStr = ''
    if (isPopular) {
      whereStr = 'WHERE count >1'
    } else {
      if (keyword) {
        whereStr = `WHERE a.tagname like '%${keyword}%'`
      }
    }

    const countSql = `SELECT tid,count(*) AS count FROM ${dbTables.BLOG_ARTICLE_TAG} group by tid`
    return this.query(`SELECT a.tid,a.tagname,count FROM ${this.table} a left join (${countSql}) b on a.tid=b.tid ${whereStr} ORDER BY ${orderArr.join(',')}`)
  }

  getTagByName(tagname) {
    return this.findOne({
      where: {
        tagname
      }
    })
  }

  getTagsByName(tagname) {
    const names = Array.isArray(tagname) ? tagname.map(item => `'${item}'`) : tagname
    return this.findAll({
      attributes: ['tid', 'tagname'],
      where: {
        tagname: names
      }
    })
  }

  updateTag(tid, params) {
    return this.update(params, { tid })
  }

  removeTag(tid) {
    return this.destroy({ tid })
  }
}

module.exports = new BlogTagModel()
