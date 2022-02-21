const DbModel = require('@app/utils/db-model')

class MenuModel extends DbModel {
  constructor() {
    super('sys_menu')
    this.order = {
      'order_num': 'ASC',
      'menu_id': 'ASC'
    }
  }

  getMenus(simple = false) {
    return this.findAll({
      order: this.order,
      attributes: simple === true ? ['menu_id', 'parent_id', 'menu_name'] : []
    })
  }

  getMenuByName(menuName) {
    return this.findOne({
      where: {
        menu_name: menuName
      }
    })
  }

  getMenusByIds(ids) {
    return this.findAll({
      where: {
        menu_id: ids
      },
      order: this.order
    })
  }

  getMenusAll() {
    return this.findAll({
      order: this.order
    })
  }

  updateMenu(menuId, params) {
    return this.update(params, {
      menu_id: menuId
    })
  }

  async delMenu(menuId) {
    await this.destroy({
      menu_id: menuId
    })
    await this.destroy({
      parent_id: menuId
    })
  }
}

module.exports = new MenuModel()
