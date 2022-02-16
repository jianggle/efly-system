<template>
  <div class="watermark" :style="{ backgroundImage: bgImage }" />
</template>

<script>
export default {
  name: 'BgWatermark',
  data() {
    return {
      timer: null,
      bgImage: ''
    }
  },
  watch: {
    '$store.getters.userName'() {
      clearInterval(this.timer)
      this.setWatermark()
    }
  },
  created() {
    this.setWatermark()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    setWatermark() {
      this.handleSet()
      this.timer = setInterval(() => {
        this.handleSet()
      }, 1000)
    },
    handleSet() {
      const timeNow = this.$utils.formatDate(Date.now(), 'yyyy-MM-dd hh:mm:ss')
      this.bgImage = `url(${this.createWatermark(this.$store.getters.userName, timeNow)})`
    },
    // svg的width和height再结合p标签中设置样式，可调整水印密集程度
    createWatermark(textOne, textTwo) {
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
  }
}
</script>

<style lang="scss" scoped>
// 若需要遮挡在所有元素之上，那么应设置一个极大的z-index值，如`99999999`
// 若不需要遮挡element-ui的弹窗，那么需要低于其`弹框的初始z-index（默认值：2000）`，如`1999`
.watermark {
  position: fixed;
  z-index: 99999999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
