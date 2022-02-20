import {
  Message,
  MessageBox,
  Notification,
  Loading
} from 'element-ui'

let loadingInstance

export default {
  msg(content) {
    Message.info(content)
  },
  msgError(content) {
    Message.error(content)
  },
  msgSuccess(content) {
    Message.success(content)
  },
  msgWarning(content) {
    Message.warning(content)
  },
  alert(content) {
    MessageBox.alert(content, '系统提示')
  },
  alertError(content) {
    MessageBox.alert(content, '系统提示', {
      type: 'error'
    })
  },
  alertSuccess(content) {
    MessageBox.alert(content, '系统提示', {
      type: 'success'
    })
  },
  alertWarning(content) {
    MessageBox.alert(content, '系统提示', {
      type: 'warning'
    })
  },
  notify(content) {
    Notification.info(content)
  },
  notifyError(content) {
    Notification.error(content)
  },
  notifySuccess(content) {
    Notification.success(content)
  },
  notifyWarning(content) {
    Notification.warning(content)
  },
  confirm(content) {
    return MessageBox.confirm(content, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  },
  prompt(content) {
    return MessageBox.prompt(content, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  },
  loading(content) {
    loadingInstance = Loading.service({
      lock: true,
      text: content,
      fullscreen: true,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
  },
  closeLoading() {
    loadingInstance.close()
  }
}
