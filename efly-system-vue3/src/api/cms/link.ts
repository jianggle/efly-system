import request from '@/utils/request'

class CmsLinkService {
  static listCategory(params: any) {
    return request({
      method: 'get',
      url: 'cms/listCmsLinkCategory',
      params,
    })
  }
  static removeCategory(data: any) {
    return request({
      method: 'post',
      url: 'cms/removeCmsLinkCategory',
      data,
    })
  }
  static addCategory(data: any) {
    return request({
      method: 'post',
      url: 'cms/addCmsLinkCategory',
      data,
    })
  }
  static modifyCategory(data: any) {
    return request({
      method: 'post',
      url: 'cms/modifyCmsLinkCategory',
      data,
    })
  }
  static orderCategory(data: any) {
    return request({
      method: 'post',
      url: 'cms/orderCmsLinkCategory',
      data,
    })
  }

  static listLink(params: any) {
    return request({
      method: 'get',
      url: 'cms/listCmsLink',
      params,
    })
  }
  static addLink(data: any) {
    return request({
      method: 'post',
      url: 'cms/addCmsLink',
      data,
    })
  }
  static modifyLink(data: any) {
    return request({
      method: 'post',
      url: 'cms/modifyCmsLink',
      data,
    })
  }
  static orderLink(data: any) {
    return request({
      method: 'post',
      url: 'cms/orderCmsLink',
      data,
    })
  }
  static updateLinkStatus(data: any) {
    return request({
      method: 'post',
      url: 'cms/updateCmsLinkStatus',
      data,
    })
  }
  static batchOperateLink(data: any) {
    return request({
      method: 'post',
      url: 'cms/batchOperateCmsLink',
      data,
    })
  }
}

export default CmsLinkService
