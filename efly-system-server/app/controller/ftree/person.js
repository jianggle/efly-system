import FtTreeModel from '#model/ft_tree.js'
import FtPersonModel from '#model/ft_person.js'
import FtRelationshipModel from '#model/ft_relationship.js'
import ParamCheck from '#utils/paramCheck.js'
import Validator from '#utils/validator.js'
import { responseSuccess, ServiceException } from '#utils/resModel.js'
import { isSuperRole } from '#controller/system/user.js'

const handleEditFtPerson = async (ctx) => {
  console.log(ctx.request.body)
  await ParamCheck.check(ctx.request.body, {
    treeId: new ParamCheck().isRequired().isNumber().isPositiveInteger(),
    name: new ParamCheck().isRequired().min(2).max(30),
    sex: new ParamCheck()
      .isRequired()
      .isNumber()
      .pattern(/^(0|1)$/),
  })

  const { id, treeId, name, sex } = ctx.request.body

  const isUpdate = Validator.isModify(ctx, 'id')

  const existItem = await FtPersonModel.findOne({
    where: { treeId, name, sex },
  })

  const params = {
    treeId,
    name,
    sex,
  }

  if (isUpdate) {
    if (existItem && existItem.id !== id) {
      throw new ServiceException('已存在同名人物')
    }
    const is_super_role = await isSuperRole(ctx.state.user.id)
    if (!is_super_role) {
      await FtTreeModel.checkAuthor(treeId, ctx.state.user.id)
    }
    await FtPersonModel.update(params, { id })
  } else {
    if (existItem) {
      throw new ServiceException('已存在同名人物')
    }
    await FtPersonModel.create({ ...params, rank: 999 })
  }

  await responseSuccess(ctx)
}

export const addFtPersonAction = (ctx) => {
  return handleEditFtPerson(ctx)
}

export const modifyFtPersonAction = (ctx) => {
  return handleEditFtPerson(ctx)
}
