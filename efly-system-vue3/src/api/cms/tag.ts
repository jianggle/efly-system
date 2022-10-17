import request, { ApiResponse } from '@/utils/request'

class CmsTagService {
  static list<T>(params = {}) {
    return request<ApiResponse<T>>({
      method: 'get',
      url: 'cms/listCmsTag',
      params,
    })
  }
  static remove<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/removeCmsTag',
      data,
    })
  }
  static add<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/addCmsTag',
      data,
    })
  }
  static modify<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/modifyCmsTag',
      data,
    })
  }
}

export default CmsTagService
