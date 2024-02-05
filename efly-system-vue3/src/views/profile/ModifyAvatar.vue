<template>
  <div class="user-info-avatar">
    <div class="avatar-box" @click="openCropper()">
      <el-avatar :icon="UserFilled" :src="userAvatar" :size="100" />
    </div>
    <el-dialog v-model="dialogVisible" append-to-body draggable title="编辑头像" width="800px" @closed="dialogClosed()">
      <el-row>
        <el-col :span="12">
          <vue-cropper
            ref="cropperRef"
            :img="avatarTemp"
            :info="true"
            :auto-crop="true"
            :auto-crop-width="200"
            :auto-crop-height="200"
            :fixed-box="true"
            style="height: 350px"
            @real-time="realTimePreview"
          />
        </el-col>
        <el-col :span="12">
          <div class="avatar-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="4">
          <el-upload action="#" :before-upload="beforeUpload" :http-request="requestUpload" :show-file-list="false">
            <el-button size="small">
              选择图片
              <el-icon class="el-icon--right"><Upload /></el-icon>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :span="8">
          <el-button size="small" :icon="ZoomIn" title="放大" @click="cropperRef.changeScale(1)" />
          <el-button size="small" :icon="ZoomOut" title="缩小" @click="cropperRef.changeScale(-1)" />
          <el-button size="small" :icon="RefreshLeft" title="逆时针旋转" @click="cropperRef.rotateLeft()" />
          <el-button size="small" :icon="RefreshRight" title="顺时针旋转" @click="cropperRef.rotateRight()" />
        </el-col>
        <el-col :span="12" style="text-align: center">
          <el-button size="small" type="primary" @click="onUpload()">保 存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// https://github.com/xyxiao001/vue-cropper
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'
import { UserFilled, Upload, ZoomIn, ZoomOut, RefreshLeft, RefreshRight } from '@element-plus/icons-vue'
import modal from '@/plugins/modal'
import useUserStore from '@/store/modules/user'
import { system_account_modifyAvatar } from '@/api/system'

const userStore = useUserStore()
const cropperRef = ref<any>()

const dialogVisible = ref(false)
const avatarTemp = ref<any>('')
const previews = ref<any>({})

const userAvatar = computed(() => {
  return userStore.info.avatar
})

function openCropper() {
  dialogVisible.value = true
  avatarTemp.value = userAvatar.value
}
function dialogClosed() {
  cropperRef.value.clearCrop()
  avatarTemp.value = ''
}

/**实时预览 */
function realTimePreview(data: any) {
  previews.value = data
}
/**覆盖默认上传行为 */
async function requestUpload() {}
/**上传预处理 */
function beforeUpload(file: File) {
  if (file.type.indexOf('image/') === -1) {
    modal.alertError('文件格式错误，请上传图片类型。如：jpg、png后缀的文件。')
  } else {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      avatarTemp.value = reader.result
    }
  }
}
/**上传图片 */
function onUpload() {
  cropperRef.value.getCropBlob((data: Blob) => {
    const formData = new FormData()
    formData.append('file', data)
    formData.append('oldAvatar', userAvatar.value)
    modal.loading('上传中...')
    system_account_modifyAvatar<string>(formData)
      .then((res) => {
        modal.closeLoading()
        dialogVisible.value = false
        userStore.updateUserAvatar(res.data)
        modal.msgSuccess('修改成功')
      })
      .catch(() => {
        modal.closeLoading()
      })
  })
}
</script>

<style lang="scss" scoped>
.user-info-avatar {
  margin-bottom: 10px;
}
.avatar-box {
  position: relative;
  width: 100px;
  height: 100px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: inset 0 0 0 5px rgba(0, 0, 0, 10%);
  &::after {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    color: #eee;
    text-align: center;
    content: '编辑头像';
    background-color: rgba(0, 0, 0, 50%);
  }
  .el-avatar {
    font-size: 36px;
  }
}
.avatar-preview {
  position: absolute;
  top: 50%;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;
  transform: translate(50%, -50%);
}
</style>
