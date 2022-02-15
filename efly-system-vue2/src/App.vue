<template>
  <router-view/>
</template>

<script>
import appConfig from '@/config'
export default {
  name: 'App',
  metaInfo() {
    return {
      title: this.$store.state.sysLayout.dynamicTitle && this.$store.state.sysLayout.title,
      titleTemplate: title => {
        return title ? `${title} - ${appConfig.siteName}` : appConfig.siteName
      }
    }
  }
}
</script>
