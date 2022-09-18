<template>
  <el-form ref="formRef" :model="editForm" :rules="editFormRules" label-position="top">
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

<script setup lang="ts" name="UserModifyPwd">
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import SystemService from '@/api/system'
import useUserStore from '@/store/modules/user'
import md5 from 'blueimp-md5'

const isSubmit = ref(false)
const formRef = ref<FormInstance>()
const editForm = reactive({
  oldPwd: '',
  newPwd: '',
  confirmPwd: ''
})
const editFormRules = reactive<FormRules>({
  oldPwd: { required: true, message: '请输入旧密码', trigger: 'blur' },
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && editForm.oldPwd === value) {
          callback(new Error('新密码不能与旧密码相同'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  confirmPwd: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (editForm.newPwd !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

function onSubmit() {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    try {
      if (!valid) return
      isSubmit.value = true
      const params = {
        oldPwd: md5(editForm.oldPwd),
        newPwd: md5(editForm.newPwd)
      }
      await SystemService.modifyAccountPwd(params)
      isSubmit.value = false
      const tipMsg = '为了加深您对新密码的记忆 以及 需要使旧密码签发过的凭证失效，请重新登录'
      await ElMessageBox.alert(tipMsg, '修改成功', {
        type: 'success',
        confirmButtonText: '去登录',
        showClose: false
      })
      await useUserStore().frontendLogout()
      useUserStore().toggleLoginDialog(true)
    } catch (error) {
      isSubmit.value = false
      console.log(error)
    }
  })
}
</script>
