<template>
  <div class="login-page">
    <div class="login-card">
      <h3>{{ siteName }}</h3>
      <LoginForm />
    </div>
  </div>
</template>

<script>
import appConfig from '@/config'
import LoginForm from '@/components/LoginForm.vue'
export default {
  name: 'PageLogin',
  components: {
    LoginForm
  },
  data() {
    return {
      siteName: appConfig.siteName,
    }
  }
}
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
  margin-top: 150px;
  width: 400px;
  background-color: #fff;
  padding: 36px 20px;
  border-radius: 6px;
  // border: 1px solid #DCDFE6;
  box-sizing: border-box;

  >h3 {
    margin-bottom: 30px;
    text-align: center;
    font-size: 36px;
    color: #666;
    font-weight: normal;
    text-transform: uppercase;
  }
}
</style>
