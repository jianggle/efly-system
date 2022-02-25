const TableModel = require('@app/model/table-model')
const { dbTables } = require('@app/config')

class BlogArticleModel extends TableModel {
  constructor() {
    super(dbTables.BLOG_ARTICLE)

    this.fullAttribute = [
      'gid', 'title', 'type', 'author', 'sortid', 'create_time', 'update_time', 'alias',
      'content', 'excerpt','views', 'comnum', 'attnum',
      'top', 'sortop', 'hide', 'checked', 'allow_remark'
    ]

    this.authorAndCategory = [
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
          sortname: 'catname'
        }
      }
    ]
  }

  getArticles({
    offset,
    limit,
    type = 'blog',
    catid,
    author,
    keyword,
    isFront = false
  }) {
    const where = {
      'a.type': type
    }
    const order = [
      ['a.top', 'DESC'],
      ['a.sortop', 'DESC'],
      ['a.create_time', 'DESC']
    ]

    if (author) {
      where['a.author'] = author
    }
    if (catid) {
      where['a.sortid'] = catid
    }
    if (keyword) {
      where['+'] = `(a.title like '%${keyword}%')`
    }

    if (isFront) {
      where['a.hide'] = 'n'
      where['a.checked'] = 'y'
      if (!author && !catid && !keyword) {
        order.splice(1, 1)
      } else {
        if (catid) {
          order.splice(0, 1)
        } else {
          order.splice(0, 2)
        }
      }
    }

    return this.findAndCountAll({
      where,
      attributes: isFront ? this.fullAttribute : this.fullAttribute.filter(item => !['content', 'excerpt'].includes(item)),
      offset,
      limit,
      order,
      join: this.authorAndCategory
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

  getPublicArticle(gid, alias) {
    const where = {
      'a.hide': 'n',
      'a.checked': 'y'
    }
    if (gid) {
      where['a.gid'] = gid
    } else {
      where['a.alias'] = alias
    }
    return this.findOne({
      where,
      attributes: this.fullAttribute,
      join: this.authorAndCategory
    })
  }

  getNeighborArticle(time, isNext = true) {
    return this.findOne({
      where: {
        type: 'blog',
        hide: 'n',
        checked: 'y',
        '+': `create_time ${isNext ? '>' : '<'} '${time}'`
      },
      attributes: ['gid', 'title'],
      order: `create_time ${isNext ? 'ASC' : 'DESC'}`
    })
  }
}

module.exports = new BlogArticleModel()
