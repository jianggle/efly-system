<template>
  <el-form ref="formRef" :model="editForm" :rules="editFormRules" label-position="top">
    <el-form-item prop="realName" label="用户姓名">
      <el-input v-model.trim="editForm.realName" maxlength="30" />
    </el-form-item>
    <el-form-item prop="phone" label="手机号码">
      <el-input v-model.trim="editForm.phone" maxlength="11" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="isSubmit" @click="onSubmit()">保存{{ isSubmit ? '中...' : '' }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import modal from '@/plugins/modal'
import { system_account_modifyInfo } from '@/api/system'
import useUserStore from '@/store/modules/user'

const emit = defineEmits(['ok'])
const props = defineProps({
  reshow: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
const reshowData = toRef(props, 'reshow')
watch(reshowData, () => {
  handleReshow()
})

const isSubmit = ref(false)
const formRef = ref<FormInstance>()
const editForm = reactive({
  realName: '',
  phone: '',
})
const editFormRules = reactive<FormRules>({
  realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
})

function handleReshow() {
  const keys = Object.keys(props.reshow)
  for (const field in editForm) {
    if (keys.includes(field)) {
      editForm[field] = props.reshow[field]
    }
  }
}

function onSubmit() {
  if (!formRef.value) return
  formRef.value.validate(async (valid) => {
    try {
      if (!valid) return
      isSubmit.value = true
      await system_account_modifyInfo(editForm)
      emit('ok')
      useUserStore().updateUserName(editForm.realName)
      modal.msgSuccess('修改成功')
    } catch (error) {
      console.log(error)
    } finally {
      isSubmit.value = false
    }
  })
}
</script>
