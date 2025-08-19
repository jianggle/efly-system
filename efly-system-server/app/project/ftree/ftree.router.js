import * as FtTreeController from './controller/FtTreeController.js'
import * as FtPersonController from './controller/FtPersonController.js'
import * as FtRelationshipController from './controller/FtRelationshipController.js'

import Router from '@koa/router'

const router = new Router()

router.post('/ftree/addFtTree', FtTreeController.addFtTreeAction)
router.post('/ftree/modifyFtTree', FtTreeController.modifyFtTreeAction)
router.post('/ftree/removeFtTree', FtTreeController.removeFtTreeAction)
router.get('/ftree/listFtTree', FtTreeController.listFtTreeAction)
router.get('/ftree/getFtTreeById', FtTreeController.getFtTreeByIdAction)

router.post('/ftree/addFtPerson', FtPersonController.addFtPersonAction)
router.post('/ftree/modifyFtPerson', FtPersonController.modifyFtPersonAction)
// router.post('/ftree/removeFtPerson', FtPersonController.removeFtPersonAction)
// router.get('/ftree/listFtPerson', FtPersonController.listFtPersonAction)

router.get('/ftree/getRelationBySex', FtRelationshipController.getRelationBySexAction)
router.get('/ftree/getRelationBySingleSex', FtRelationshipController.getRelationBySingleSexAction)
router.post('/ftree/buildFtRelation', FtRelationshipController.buildFtRelationAction)
router.post('/ftree/addFtRelation', FtRelationshipController.addFtRelationAction)

export default router
