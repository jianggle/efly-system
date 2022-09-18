import request from '@/utils/request'

class CmsTagService {
  static list(params: any) {
    return request({
      method: 'get',
      url: 'cms/listCmsTag',
      params,
    })
  }
  static remove(data: any) {
    return request({
      method: 'post',
      url: 'cms/removeCmsTag',
      data,
    })
  }
  static add(data: any) {
    return request({
      method: 'post',
      url: 'cms/addCmsTag',
      data,
    })
  }
  static modify(data: any) {
    return request({
      method: 'post',
      url: 'cms/modifyCmsTag',
      data,
    })
  }
}

export default CmsTagService
