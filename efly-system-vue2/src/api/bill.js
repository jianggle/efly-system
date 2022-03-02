import request from '@/utils/request'

export function list_bill_record(params) {
  return request({
    method: 'get',
    url: 'bill/listBillRecord',
    params
  })
}
export function import_bill_record(data) {
  return request({
    method: 'post',
    url: 'bill/importBillRecord',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
export function batch_record_to_book(data) {
  return request({
    method: 'post',
    url: 'bill/batchRecordToBook',
    data
  })
}

export function list_bill_book(params) {
  return request({
    method: 'get',
    url: 'bill/listBillBook',
    params
  })
}
export function add_bill_book(data) {
  return request({
    method: 'post',
    url: 'bill/addBillBook',
    data
  })
}
export function modify_bill_book(data) {
  return request({
    method: 'post',
    url: 'bill/modifyBillBook',
    data
  })
}
export function remove_bill_book(data) {
  return request({
    method: 'post',
    url: 'bill/removeBillBook',
    data
  })
}
export function count_bill_book(data) {
  return request({
    method: 'post',
    url: 'bill/countBillBook',
    data
  })
}
export function remove_bill_book_record(data) {
  return request({
    method: 'post',
    url: 'bill/removeBillBookRecord',
    data
  })
}
