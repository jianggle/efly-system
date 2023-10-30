import type { FormInstance } from 'element-plus'
import { DEFAULT_PAGE_SIZE, DEFAULT_FIRST_PAGE } from '@/config/constantValues'

interface UseListOptions {
  /**获取数据api方法(必传) */
  api: (params: any) => Promise<any>
  /**查询参数(非必传，默认为{}) */
  params?: object
  /**是否有分页(非必传，默认为true) */
  isPageable?: boolean
  /**格式化params方法(非必传) */
  formatParams?: (params: any) => object
  /**格式化返回数据(非必传) */
  formatCallback?: (params: any) => any[]
  /**结果回调(非必传) */
  resultCallback?: (params: any) => void
}

const useList = <T>({
  api,
  params = {},
  isPageable = true,
  formatParams,
  formatCallback,
  resultCallback,
}: UseListOptions) => {
  const queryFormRef = ref<FormInstance>()
  const pageInfo = reactive({
    pageSize: DEFAULT_PAGE_SIZE,
    currentPage: DEFAULT_FIRST_PAGE,
  })
  const isLoading = ref(true)
  const itemList = ref<T>([] as any)
  const itemCount = ref(0)

  const handleGetList = async () => {
    try {
      isLoading.value = true
      let queryParams = params
      if (typeof formatParams === 'function') {
        queryParams = formatParams(queryParams)
      }
      const { data } = await api({
        ...(isPageable ? pageInfo : {}),
        ...queryParams,
      })
      let tempData = isPageable ? data.rows : data
      if (typeof formatCallback === 'function') {
        tempData = formatCallback(tempData)
      }
      if (typeof resultCallback === 'function') {
        resultCallback(tempData)
      }
      itemList.value = tempData
      if (isPageable) {
        itemCount.value = data.count
      }
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const handleQuery = () => {
    if (isPageable) {
      pageInfo.currentPage = DEFAULT_FIRST_PAGE
    }
    handleGetList()
  }

  const handleReset = () => {
    if (!queryFormRef.value) return
    queryFormRef.value.resetFields()
    handleQuery()
  }

  handleQuery()

  return {
    queryFormRef,
    pageInfo,
    isLoading,
    itemList,
    itemCount,
    handleGetList,
    handleQuery,
    handleReset,
  }
}

export default useList
