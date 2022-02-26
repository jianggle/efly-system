const TableModel = require('@app/model/table-model')
const { dbTables } = require('@app/config')

class BlogLinkModel extends TableModel {
  constructor() {
    super(dbTables.BLOG_LINK)
  }

  getLinks(offset, limit, status, catid, keyword) {
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
        table: dbTables.BLOG_LINK_CATEGORY,
        primaryKey: 'catid',
        foreignKey: 'catid',
        attributes: {
          catname: 'catname'
        }
      }]
    })
  }

  getLinksByCatid(catid) {
    return this.findAll({
      where: {
        catid,
        hide: 'n'
      },
      attributes: ['sitename', 'siteurl', 'description'],
      order: 'taxis ASC,id DESC'
    })
  }

  getOneLink(params = {}) {
    return this.findOne({
      where: params,
      attributes: ['id', 'sitename', 'siteurl']
    })
  }

  updateLinkById(id, params) {
    return this.update(params, { id })
  }

  removeLinkById(id) {
    return this.destroy({ id })
  }

  removeLinkByCatid(catid) {
    return this.destroy({ catid })
  }
}

module.exports = new BlogLinkModel()
