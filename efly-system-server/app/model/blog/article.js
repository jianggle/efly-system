const TableModel = require('@app/model/table-model')
const { dbTables } = require('@app/config')

class BlogArticleModel extends TableModel {
  constructor() {
    super(dbTables.BLOG_ARTICLE)
  }

  getArticles(offset, limit, type, catid, author, keyword) {
    const where = {
      'a.type': type || 'blog'
    }
    if (author) {
      where['a.author'] = author
    }
    if (catid) {
      where['a.sortid'] = catid
    }
    if (keyword) {
      where['+'] = `(a.title like '%${keyword}%')`
    }
    return this.findAndCountAll({
      where,
      attributes: ['gid', 'title', 'create_time', 'update_time', 'author', 'sortid', 'type', 'views', 'comnum', 'attnum', 'top', 'sortop', 'hide', 'checked', 'allow_remark'],
      offset,
      limit,
      order: {
        'a.hide': 'DESC',
        'a.create_time': 'DESC',
      },
      join: [
        {
          table: dbTables.SYSTEM_USER,
          primaryKey: 'author',
          foreignKey: 'user_id',
          attributes: {
            real_name: 'authorName'
          }
        },
        {
          table: dbTables.BLOG_CATEGORY,
          primaryKey: 'sortid',
          foreignKey: 'sid',
          attributes: {
            sortname: 'catName'
          }
        }
      ]
    })
  }

  getOneArticle(params = {}) {
    return this.findOne({
      where: params,
      attributes: ['gid', 'title', 'alias']
    })
  }

  getArticleById(gid) {
    return this.findOne({
      where: { gid }
    })
  }

  updateArticleById(gid, params) {
    return this.update(params, { gid })
  }

  updateArticleByCatid(sortid, params) {
    return this.update(params, { sortid })
  }

  removeArticle(gid) {
    return this.destroy({ gid })
  }
}

module.exports = new BlogArticleModel()
