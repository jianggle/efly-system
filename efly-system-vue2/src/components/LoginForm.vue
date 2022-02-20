<template>
  <el-form ref="formRef" :model="form" :rules="formRules">
    <el-form-item prop="username">
      <el-input
        v-model.trim="form.username"
        placeholder="账号"
        prefix-icon="el-icon-user"
        clearable
        @keyup.enter.native="onSubmit"
      />
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="form.password"
        placeholder="密码"
        prefix-icon="el-icon-lock"
        show-password
        @keyup.enter.native="onSubmit"
      />
    </el-form-item>
    <el-form-item prop="code">
      <el-input
        v-model.trim="form.code"
        placeholder="验证码"
        prefix-icon="el-icon-picture-outline"
        style="width:60%;"
        @keyup.enter.native="onSubmit"
      />
      <div id="captchaEl" v-loading="isCaptchaLoading" class="captcha-box" @click="getCaptcha()" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="isSubmit" @click="onSubmit">
        登录{{ isSubmit ? '中' : '' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { common_captcha } from '@/api/systemBase'
import md5 from 'blueimp-md5'
export default {
  name: 'LoginForm',
  props: {
    reLogin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isCaptchaLoading: false,
      isSubmit: false,
      form: {
        username: '',
        password: '',
        code: '',
        captchaId: '',
      },
      formRules: {
        username: [
          { required: true, message: '请输入您的账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入您的密码', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.getCaptcha()
  },
  methods: {
    async getCaptcha() {
      try {
        this.isCaptchaLoading = true
        const res = await common_captcha()
        this.form.captchaId = res.data.id
        document.getElementById('captchaEl').innerHTML = res.data.image
      } catch (error) {
        console.log(error)
      } finally {
        this.isCaptchaLoading = false
      }
    },
    onSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return false
        const params = { ...this.form }
        params.password = md5(params.password)
        this.handleLogin(params)
      })
    },
    async handleLogin(params) {
      try {
        this.isSubmit = true
        await this.$store.dispatch('user/login', params)
        if (this.reLogin) {
          this.$store.commit('user/CLOSE_LOGIN_FORM')
          this.$message.success('登录成功')
        } else {
          this.$router.push(this.$route.query.backUrl || '/')
        }
      } catch (error) {
        console.log(error)
        this.getCaptcha()
      } finally {
        this.isSubmit = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button {
  margin-top: 14px;
  width: 100%;
}
.captcha-box {
  float: right;
  margin-right: 20px;
  cursor: pointer;
}
</style>
