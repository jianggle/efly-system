import request from '@/utils/request'

class CmsService {
  static upload_file(data: any) {
    return request({
      method: 'post',
      url: 'cms/uploadFile',
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }
}

export default CmsService
