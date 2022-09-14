const BaseModel = require('@app/utils/db_orm')
const { dbTables } = require('@app/config')

class CmsArticleTagModel extends BaseModel {
  constructor() {
    super(dbTables.CMS_ARTICLE_TAG)
  }

  getList(gid, isValid = true) {
    const joinMethod = isValid ? 'join' : 'left join'
    return this.query(`select a.tid,b.tagname from ${this.table} as a ${joinMethod} ${dbTables.CMS_TAG} as b on a.tid=b.tid where gid=${gid}`)
  }

  addList(gid, ids) {
    const values = ids.map(item => `(${gid}, ${item})`).join(',')
    return this.query(`INSERT INTO ${this.table} (gid, tid) VALUES ${values};`)
  }
}

module.exports = new CmsArticleTagModel()
