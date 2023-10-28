<template>
  <el-form ref="formRef" :model="editForm" :rules="editFormRules">
    <el-form-item prop="oldPwd" label="旧密码">
      <el-input v-model="editForm.oldPwd" placeholder="请输入旧密码" show-password />
    </el-form-item>
    <el-form-item prop="newPwd" label="新密码">
      <el-input v-model="editForm.newPwd" placeholder="请输入新密码" show-password />
    </el-form-item>
    <el-form-item prop="confirmPwd" label="确认密码">
      <el-input v-model="editForm.confirmPwd" placeholder="请确认密码" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="isSubmit" @click="onSubmit()">
        保存{{ isSubmit ? '中...' : '' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { user_modify_pwd } from '@/api/system'
import md5 from 'blueimp-md5'
export default {
  name: 'UserModifyPwd',
  data() {
    return {
      isSubmit: false,
      editForm: {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      editFormRules: {
        oldPwd: { required: true, message: '请输入旧密码', trigger: 'blur' },
        newPwd: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value && this.editForm.oldPwd === value) {
              callback(new Error('新密码不能与旧密码相同'))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (this.editForm.newPwd !== value) {
              callback(new Error('两次输入的密码不一致'))
            } else {
              callback()
            }
          }, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit() {
      try {
        await this.$refs.formRef.validate()
        this.isSubmit = true
        const params = {
          oldPwd: md5(this.editForm.oldPwd),
          newPwd: md5(this.editForm.newPwd)
        }
        await user_modify_pwd(params)
        const tipMsg = '为了加深您对新密码的记忆 以及 需要使旧密码签发过的凭证失效，请重新登录'
        this.$alert(tipMsg, '修改成功', {
          confirmButtonText: '去登录'
        }).then(() => {
          this.$store.dispatch('user/frontendLogout').then(() => {
            this.$store.commit('user/toggleLoginDialog', true)
          })
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.isSubmit = false
      }
    }
  }
}
</script>
