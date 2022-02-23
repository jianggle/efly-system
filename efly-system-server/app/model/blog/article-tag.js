const TableModel = require('@app/model/table-model')
const { dbTables } = require('@app/config')

class BlogArticleTagModel extends TableModel {
  constructor() {
    super(dbTables.BLOG_ARTICLE_TAG)
  }

  getArticleTags(gid, isValid = true) {
    const joinMethod = isValid ? 'join' : 'left join'
    return this.query(`select a.tid,b.tagname from ${this.table} as a ${joinMethod} ${dbTables.BLOG_TAG} as b on a.tid=b.tid where gid=${gid}`)
  }

  removeArticleTagsByFull(gid, ids) {
    return this.destroy({
      gid,
      tid: ids
    })
  }

  removeArticleTagsByGid(gid) {
    return this.destroy({ gid })
  }

  removeArticleTagsByTid(tid) {
    return this.destroy({ tid })
  }

  addArticleTags(gid, ids) {
    const values = ids.map(item => `(${gid}, ${item})`).join(',')
    return this.query(`INSERT INTO ${this.table} (gid, tid) VALUES ${values};`)
  }
}

module.exports = new BlogArticleTagModel()
