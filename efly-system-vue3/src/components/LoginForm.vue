<template>
  <el-form ref="formRef" :model="form" :rules="rules">
    <el-form-item prop="username">
      <el-input
        v-model.trim="form.username"
        placeholder="账号"
        :prefix-icon="User"
        clearable
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="form.password"
        placeholder="密码"
        :prefix-icon="Lock"
        show-password
      />
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        v-model.trim="form.code"
        placeholder="验证码"
        :prefix-icon="Picture"
        style="width: 60%"
        @keyup.enter.native="onSubmit(formRef)"
      />
      <div
        id="captchaEl"
        v-loading="isCaptchaLoading"
        style="float: right; margin-right: 20px; cursor: pointer"
        @click="refreshCaptcha()"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        :loading="isSubmit"
        @click="onSubmit(formRef)"
        style="width: 100%; margin-top: 14px"
      >
        登录{{ isSubmit ? '中' : '' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="LoginForm">
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { User, Lock, Picture } from '@element-plus/icons-vue'
import md5 from 'blueimp-md5'
import SystemService from '@/api/system'
import useUserStore from '@/store/modules/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const props = defineProps({
  reLogin: {
    type: Boolean,
    default: false,
  },
})

const isCaptchaLoading = ref(false)
const isSubmit = ref(false)

const formRef = ref<FormInstance>()
const form = reactive({
  username: '',
  password: '',
  code: '',
})
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入您的账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入您的密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
})

const refreshCaptcha = async () => {
  try {
    isCaptchaLoading.value = true
    const res = await SystemService.getCaptcha<{ image: string }>()
    const captchaEl = document.getElementById('captchaEl')
    if (captchaEl) {
      captchaEl.innerHTML = res.data.image
    }
  } catch (error) {
    console.log(error)
  } finally {
    isCaptchaLoading.value = false
  }
}

const onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      handleLogin()
    }
  })
}

const handleLogin = async () => {
  try {
    isSubmit.value = true
    const params = { ...form }
    params.password = md5(params.password)
    await userStore.login(params)
    if (props.reLogin) {
      userStore.toggleLoginDialog(false)
      ElMessage.success('登录成功')
    } else {
      router.push(String(route.query.backUrl || '/'))
    }
  } catch (error) {
    console.log(error)
    refreshCaptcha()
  } finally {
    isSubmit.value = false
  }
}

refreshCaptcha()
</script>
