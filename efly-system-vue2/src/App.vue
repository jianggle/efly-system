<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import appConfig from '@/config'
export default {
  name: 'App',
  metaInfo() {
    return {
      title: this.$store.state.app.setting.dynamicTitle && this.$store.state.app.title,
      titleTemplate: title => {
        return title ? `${title} - ${appConfig.siteName}` : appConfig.siteName
      }
    }
  }
}
</script>
