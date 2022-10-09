<template>
  <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" effect="dark" placement="bottom">
    <SvgIcon
      :name="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="onToggle()"
    />
  </el-tooltip>
</template>

<script>
import screenfull from 'screenfull'
export default {
  name: 'HeaderScreenfull',
  data() {
    return {
      isFullscreen: false
    }
  },
  mounted() {
    if (screenfull.isEnabled) {
      screenfull.on('change', this.handleChange)
    }
  },
  beforeUnmount() {
    if (screenfull.isEnabled) {
      screenfull.off('change', this.handleChange)
    }
  },
  methods: {
    handleChange() {
      this.isFullscreen = screenfull.isFullscreen
    },
    onToggle() {
      if (!screenfull.isEnabled) {
        this.$modal.msgWarning('your browser can not work')
        return false
      }
      screenfull.toggle()
    }
  }
}
</script>
