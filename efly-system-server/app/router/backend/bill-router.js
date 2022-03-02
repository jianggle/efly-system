const BillRecordController = require('@app/controller/bill/record')
const BillBookController = require('@app/controller/bill/book')

const Router = require('@koa/router')
const router = new Router()

const upload = require('@app/utils/upload')

router.get('/bill/listBillRecord', BillRecordController.listBillRecordAction)
router.post('/bill/importBillRecord', upload().single('file'), BillRecordController.importBillRecordAction)

router.get('/bill/listBillBook', BillBookController.listBillBookAction)
router.post('/bill/addBillBook', BillBookController.addBillBookAction)
router.post('/bill/modifyBillBook', BillBookController.modifyBillBookAction)
router.post('/bill/removeBillBook', BillBookController.removeBillBookAction)
router.post('/bill/countBillBook', BillBookController.countBillBookAction)

router.post('/bill/batchRecordToBook', BillBookController.batchRecordToBookAction)
router.post('/bill/removeBillBookRecord', BillBookController.removeBillBookRecordAction)

module.exports = router
