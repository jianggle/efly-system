import {
  ElMessage,
  ElMessageBox,
  ElMessageBoxOptions,
  ElNotification,
  ElLoading,
} from 'element-plus'

let loadingInstance: any = undefined

const defaultMessageBoxOptions = {
  showClose: false,
  closeOnClickModal: false,
  closeOnPressEscape: false,
}

export default {
  msg(content: string) {
    ElMessage.info(content)
  },
  msgSuccess(content: string) {
    ElMessage.success(content)
  },
  msgError(content: string) {
    ElMessage.error(content)
  },
  msgWarning(content: string) {
    ElMessage.warning(content)
  },
  confirm(content: string, options?: ElMessageBoxOptions) {
    options = options || {}
    return ElMessageBox.confirm(content, '系统提示', {
      ...defaultMessageBoxOptions,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      ...options,
    })
  },
  alert(content: string, options?: ElMessageBoxOptions) {
    options = options || {}
    return ElMessageBox.alert(content, '系统提示', {
      ...defaultMessageBoxOptions,
      ...options,
    })
  },
  alertSuccess(content: string, options?: ElMessageBoxOptions) {
    options = options || {}
    return ElMessageBox.alert(content, '系统提示', {
      ...defaultMessageBoxOptions,
      ...options,
      type: 'success',
    })
  },
  alertError(content: string, options?: ElMessageBoxOptions) {
    options = options || {}
    return ElMessageBox.alert(content, '系统提示', {
      ...defaultMessageBoxOptions,
      ...options,
      type: 'error',
    })
  },
  alertWarning(content: string, options?: ElMessageBoxOptions) {
    options = options || {}
    return ElMessageBox.alert(content, '系统提示', {
      ...defaultMessageBoxOptions,
      ...options,
      type: 'warning',
    })
  },
  notify(content: string) {
    ElNotification.info(content)
  },
  notifySuccess(content: string) {
    ElNotification.success(content)
  },
  notifyError(content: string) {
    ElNotification.error(content)
  },
  notifyWarning(content: string) {
    ElNotification.warning(content)
  },
  loading(content: string) {
    loadingInstance = ElLoading.service({
      text: content,
      lock: true,
      fullscreen: true,
      background: 'rgba(0, 0, 0, 0.7)',
    })
  },
  closeLoading() {
    loadingInstance && loadingInstance.close()
  },
}
