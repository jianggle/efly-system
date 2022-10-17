import request, { ApiResponse } from '@/utils/request'

class CmsService {
  static upload_file(data = {}) {
    return request<ApiResponse<string>>({
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
