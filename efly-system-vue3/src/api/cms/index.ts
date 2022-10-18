import request, { ApiResponse } from '@/utils/request'

export function cms_upload(data = {}) {
  return request<ApiResponse<string>>({
    method: 'post',
    url: 'cms/uploadFile',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
