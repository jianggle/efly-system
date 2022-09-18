import request from '@/utils/request'

class CmsArticleService {
  static list(params: any) {
    return request({
      method: 'get',
      url: 'cms/listCmsArticle',
      params,
    })
  }
  static add(data: any) {
    return request({
      method: 'post',
      url: 'cms/addCmsArticle',
      data,
    })
  }
  static modify(data: any) {
    return request({
      method: 'post',
      url: 'cms/modifyCmsArticle',
      data,
    })
  }
  static info(params: any) {
    return request({
      method: 'get',
      url: 'cms/infoCmsArticle',
      params,
    })
  }
  static updateStatus(data: any) {
    return request({
      method: 'post',
      url: 'cms/updateCmsArticleStatus',
      data,
    })
  }
  static batchOperate(data: any) {
    return request({
      method: 'post',
      url: 'cms/batchOperateCmsArticle',
      data,
    })
  }
}

export default CmsArticleService
