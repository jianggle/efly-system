<template>
  <div class="login-page">
    <div class="login-card">
      <h3>{{ AppConfig.siteName }}</h3>
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppConfig from '@/config'
import LoginForm from '@/components/LoginForm.vue'

defineOptions({
  name: 'PageLogin',
})
</script>

<style lang="scss">
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}
.login-card {
  // border: 1px solid #DCDFE6;
  box-sizing: border-box;
  width: 400px;
  padding: 36px 20px;
  margin-top: 150px;
  background-color: #fff;
  border-radius: 6px;
  > h3 {
    margin-bottom: 30px;
    font-size: 36px;
    font-weight: normal;
    color: #666;
    text-align: center;
    text-transform: uppercase;
  }
}
</style>
