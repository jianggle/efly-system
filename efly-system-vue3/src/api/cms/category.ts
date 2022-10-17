import request, { ApiResponse } from '@/utils/request'

class CmsCategoryService {
  static list<T>(params = {}) {
    return request<ApiResponse<T>>({
      method: 'get',
      url: 'cms/listCmsCategory',
      params,
    })
  }
  static remove<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/removeCmsCategory',
      data,
    })
  }
  static add<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/addCmsCategory',
      data,
    })
  }
  static modify<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/modifyCmsCategory',
      data,
    })
  }
  static order<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/orderCmsCategory',
      data,
    })
  }
}

export default CmsCategoryService
