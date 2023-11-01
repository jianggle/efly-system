<template>
  <el-tooltip
    :content="isFullscreen ? '退出全屏' : '全屏'"
    effect="dark"
    placement="bottom"
  >
    <svg-icon
      :name="isFullscreen ? 'exit-fullscreen' : 'fullscreen'"
      @click="toggle()"
    />
  </el-tooltip>
</template>

<script setup lang="ts">
// https://vueuse.org/core/useFullscreen/
import { useFullscreen } from '@vueuse/core'
const { isFullscreen, enter, exit, toggle } = useFullscreen()
</script>
