<template>
  <div class="user-info-avatar">
    <div class="avatar-box" @click="openCropper()">
      <el-avatar icon="el-icon-user-solid" :src="userAvatar" :size="100" />
    </div>
    <el-dialog
      title="编辑头像"
      :visible.sync="dialogVisible"
      :append-to-body="true"
      width="800px"
      @closed="dialogClosed()"
    >
      <el-row>
        <el-col :span="12">
          <vue-cropper
            ref="cropper"
            :img="avatarTemp"
            :info="true"
            :auto-crop="true"
            :auto-crop-width="200"
            :auto-crop-height="200"
            :fixed-box="true"
            style="height: 350px"
            @realTime="realTime"
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
          <el-upload action="#" :http-request="requestUpload" :show-file-list="false" :before-upload="beforeUpload">
            <el-button size="small">选择图片<i class="el-icon-upload2 el-icon--right" /></el-button>
          </el-upload>
        </el-col>
        <el-col :span="8">
          <el-button size="small" icon="el-icon-zoom-in" title="放大" @click="$refs.cropper.changeScale(1)" />
          <el-button size="small" icon="el-icon-zoom-out" title="缩小" @click="$refs.cropper.changeScale(-1)" />
          <el-button size="small" icon="el-icon-refresh-left" title="逆时针旋转" @click="$refs.cropper.rotateLeft()" />
          <el-button
            size="small"
            icon="el-icon-refresh-right"
            title="顺时针旋转"
            @click="$refs.cropper.rotateRight()"
          />
        </el-col>
        <el-col :span="12" style="text-align: center">
          <el-button size="small" type="primary" @click="onUpload()">保 存</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { user_modify_avatar } from '@/api/system'
import { mapGetters } from 'vuex'
// https://github.com/xyxiao001/vue-cropper
import { VueCropper } from 'vue-cropper'
export default {
  name: 'UserModifyAvatar',
  components: {
    VueCropper,
  },
  data() {
    return {
      dialogVisible: false,
      avatarTemp: '',
      previews: {},
    }
  },
  computed: {
    ...mapGetters(['userAvatar']),
  },
  methods: {
    openCropper() {
      this.dialogVisible = true
      this.avatarTemp = this.userAvatar
    },
    dialogClosed() {
      this.$refs.cropper.clearCrop()
      this.avatarTemp = ''
    },
    realTime(data) {
      this.previews = data
    },
    requestUpload() {},
    beforeUpload(file) {
      if (file.type.indexOf('image/') === -1) {
        this.$modal.msgError('文件格式错误，请上传图片类型。如：jpg、png后缀的文件。')
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.avatarTemp = reader.result
        }
      }
    },
    onUpload() {
      this.$refs.cropper.getCropBlob((data) => {
        const formData = new FormData()
        formData.append('file', data)
        formData.append('oldAvatar', this.userAvatar)
        user_modify_avatar(formData).then((res) => {
          this.dialogVisible = false
          this.$store.commit('user/updateUserAvatar', res.data)
          this.$modal.msgSuccess('修改成功')
        })
      })
    },
  },
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
