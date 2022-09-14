const BaseModel = require('@app/utils/db_orm')
const { dbTables } = require('@app/config')

class CmsLinkModel extends BaseModel {
  constructor() {
    super(dbTables.CMS_LINK)
  }

  getList(offset, limit, status, catid, keyword) {
    const where = {}
    if (['n', 'y'].includes(status)) {
      where['hide'] = status
    }
    if (catid) {
      where['a.catid'] = catid
    }
    if (keyword) {
      where['+'] = `(a.sitename like '%${keyword}%')`
    }
    return this.findAndCountAll({
      where,
      attributes: ['id', 'catid', 'sitename', 'siteurl', 'description', 'hide', 'taxis'],
      offset,
      limit,
      order: 'a.taxis ASC,a.id DESC',
      join: [{
        table: dbTables.CMS_LINK_CATEGORY,
        primaryKey: 'catid',
        foreignKey: 'catid',
        attributes: {
          catname: 'catname'
        }
      }]
    })
  }

  getListByCatid(catid) {
    return this.findAll({
      where: {
        catid,
        hide: 'n'
      },
      attributes: ['sitename', 'siteurl', 'description'],
      order: 'taxis ASC,id DESC'
    })
  }
}

module.exports = new CmsLinkModel()
