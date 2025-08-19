import BaseModel from '#utils/db_orm.js'
import { dbTables } from '#config/index.js'
import { ServiceException } from '#utils/resModel.js'

class FtTreeModel extends BaseModel {
  constructor() {
    super(dbTables.FT_TREE)
  }

  getList(userId) {
    const where = {}
    if (userId) {
      where['a.tree_author'] = userId
    }
    return this.findAll({
      attributes: [
        `tree_id`,
        `tree_name`,
        `tree_desc`,
        `tree_author`,
        `create_time`,
        `update_time`,
      ],
      where,
      order: 'a.create_time DESC',
      join: [
        {
          table: dbTables.SYS_USER,
          primaryKey: 'tree_author',
          foreignKey: 'user_id',
          attributes: {
            real_name: 'treeAuthorName',
          },
        },
      ],
    })
  }

  async checkAuthor(treeId, userId) {
    const result = await this.findOne({ where: { treeId } })
    if (!result) {
      throw new ServiceException('家谱不存在')
    }
    if (result.treeAuthor !== userId) {
      throw new ServiceException('非法操作！只能操作自己创建的家谱')
    }
  }
}

export default new FtTreeModel()
