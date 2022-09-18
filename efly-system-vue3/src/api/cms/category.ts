import request from '@/utils/request'

class CmsCategoryService {
  static list(params: any) {
    return request({
      method: 'get',
      url: 'cms/listCmsCategory',
      params,
    })
  }
  static remove(data: any) {
    return request({
      method: 'post',
      url: 'cms/removeCmsCategory',
      data,
    })
  }
  static add(data: any) {
    return request({
      method: 'post',
      url: 'cms/addCmsCategory',
      data,
    })
  }
  static modify(data: any) {
    return request({
      method: 'post',
      url: 'cms/modifyCmsCategory',
      data,
    })
  }
  static order(data: any) {
    return request({
      method: 'post',
      url: 'cms/orderCmsCategory',
      data,
    })
  }
}

export default CmsCategoryService
