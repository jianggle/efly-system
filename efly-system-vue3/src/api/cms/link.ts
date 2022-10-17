import request, { ApiResponse, ApiListRes } from '@/utils/request'

class CmsLinkService {
  static listCategory<T>(params = {}) {
    return request<ApiResponse<T>>({
      method: 'get',
      url: 'cms/listCmsLinkCategory',
      params,
    })
  }
  static removeCategory<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/removeCmsLinkCategory',
      data,
    })
  }
  static addCategory<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/addCmsLinkCategory',
      data,
    })
  }
  static modifyCategory<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/modifyCmsLinkCategory',
      data,
    })
  }
  static orderCategory<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/orderCmsLinkCategory',
      data,
    })
  }

  static listLink<T>(params = {}) {
    return request<ApiResponse<ApiListRes<T>>>({
      method: 'get',
      url: 'cms/listCmsLink',
      params,
    })
  }
  static addLink<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/addCmsLink',
      data,
    })
  }
  static modifyLink<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/modifyCmsLink',
      data,
    })
  }
  static orderLink<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/orderCmsLink',
      data,
    })
  }
  static updateLinkStatus<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/updateCmsLinkStatus',
      data,
    })
  }
  static batchOperateLink<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/batchOperateCmsLink',
      data,
    })
  }
}

export default CmsLinkService
