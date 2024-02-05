<template>
  <div class="watermark" :style="{ backgroundImage: bgImage }" />
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { formatDate } from '@/utils'

const timer = ref<number>(0)
const bgImage = ref('')

const userName = computed(() => {
  return useUserStore().info.name
})

function setWatermark() {
  handleSet()
  timer.value = window.setInterval(() => {
    handleSet()
  }, 1000)
}
function handleSet() {
  const timeNow = formatDate(Date.now())
  bgImage.value = `url(${createWatermark(userName.value, timeNow)})`
}
/**
 * 生成水印svg
 * @description svg的width和height再结合p标签中设置样式，可调整水印密集程度
 * @param textOne 第一行文字（如：用户名）
 * @param textTwo 第二行文字（如：当前时间）
 */
function createWatermark(textOne: string, textTwo: string) {
  const svgStr = `
  <svg xmlns="http://www.w3.org/2000/svg" width="170px" height="90px">
    <foreignObject width="100%" height="100%">
      <body xmlns="http://www.w3.org/1999/xhtml">
        <p style="font-size:16px;font-weight:100;text-align:center;color:rgb(0,0,0,0.2);transform:rotate(-30deg);">
          ${textOne}<br/>
          <span style="font-size:14px;">${textTwo}</span>
        </p>
      </body>
    </foreignObject>
  </svg>`
  return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgStr)))}`
}

function clearTimer() {
  if (timer.value) {
    clearInterval(timer.value)
  }
}

setWatermark()

watch(userName, () => {
  clearTimer()
  setWatermark()
})

onBeforeUnmount(() => {
  clearTimer()
})
</script>

<style lang="scss" scoped>
// 若需要遮挡在所有元素之上，那么应设置一个极大的z-index值，如`99999999`
// 若不需要遮挡element-ui的弹窗，那么需要低于其`弹框的初始z-index（默认值：2000）`，如`1999`
.watermark {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999999;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
