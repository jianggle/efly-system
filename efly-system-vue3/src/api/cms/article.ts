import request, { ApiResponse, ApiListRes } from '@/utils/request'

class CmsArticleService {
  static list<T>(params = {}) {
    return request<ApiResponse<ApiListRes<T>>>({
      method: 'get',
      url: 'cms/listCmsArticle',
      params,
    })
  }
  static add<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/addCmsArticle',
      data,
    })
  }
  static modify<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/modifyCmsArticle',
      data,
    })
  }
  static info<T>(params = {}) {
    return request<ApiResponse<T>>({
      method: 'get',
      url: 'cms/infoCmsArticle',
      params,
    })
  }
  static updateStatus<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/updateCmsArticleStatus',
      data,
    })
  }
  static batchOperate<T>(data = {}) {
    return request<ApiResponse<T>>({
      method: 'post',
      url: 'cms/batchOperateCmsArticle',
      data,
    })
  }
}

export default CmsArticleService
