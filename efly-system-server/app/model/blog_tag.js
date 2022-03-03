const BaseModel = require('@app/utils/db_orm')
const { dbTables } = require('@app/config')

class BlogTagModel extends BaseModel {
  constructor() {
    super(dbTables.BLOG_TAG)
  }

  getList(isPopular = false, keyword = '') {
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

  getListByTagname(tagname) {
    const names = Array.isArray(tagname) ? tagname.map(item => `'${item}'`) : tagname
    return this.findAll({
      attributes: ['tid', 'tagname'],
      where: {
        tagname: names
      }
    })
  }
}

module.exports = new BlogTagModel()
