<template>
  <div class="app-tabbar-inner">
    <div class="app-tabbar-icon" :class="{gray:left==0}" @click="arrowLeft()">
      <i class="el-icon-d-arrow-left"></i>
    </div>
    <div class="app-tabbar-main" ref="scrollWrap" @wheel.prevent="scroll">
      <div class="app-tabbar-content" ref="scrollCont" :style="{left: left + 'px'}">
        <slot/>
      </div>
    </div>
    <div class="app-tabbar-icon" :class="{gray:rightEnd}" @click="arrowRight()">
      <i class="el-icon-d-arrow-right"></i>
    </div>
    <el-dropdown class="app-tabbar-tool" @command="panelCommand">
      <div class="app-tabbar-icon">
        <i class="el-icon-arrow-down"></i>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'HeaderTabWrapper',
  data() {
    return {
      left: 0,
      wheelSpeed: 30,
      rightEnd: true
    }
  },
  watch: {
    left: {
      handler(newVal, oldVal) {
        const scrollWrapWidth = this.$refs.scrollWrap.offsetWidth
        const scrollContWidth = this.$refs.scrollCont.offsetWidth
        if (scrollContWidth > scrollWrapWidth) {
          if (Math.abs(this.left) >= (scrollContWidth - scrollWrapWidth)) {
            this.rightEnd = true
          } else {
            this.rightEnd = false
          }
        } else {
          this.rightEnd = true
        }
      }
    }
  },
  methods: {
    scroll(e) {
      const scrollWrapWidth = this.$refs.scrollWrap.offsetWidth
      const scrollContWidth = this.$refs.scrollCont.offsetWidth
      if (scrollContWidth > scrollWrapWidth) {
        // 统一不同浏览器下wheel事件的滚动值
        // chrome/FF/Edge/IE11/IE10/IE9
        // e.deltaY > 0 即鼠标滚轮向下滚动，则该条向右滚动，left值变负
        const scrollSpace = e.deltaY > 0 ? -1 * this.wheelSpeed : this.wheelSpeed
        if (e.deltaY > 0) {
          if (Math.abs(this.left + scrollSpace) <= (scrollContWidth - scrollWrapWidth)) {
            this.left += scrollSpace
          } else {
            this.rightEnd = true
          }
        } else {
          if (this.left + scrollSpace < 0) {
            this.left += scrollSpace
          } else {
            this.left = 0
          }
        }
      } else {
        return
      }
    },
    arrowLeft() {
      const scrollWrapWidth = this.$refs.scrollWrap.offsetWidth
      const scrollContWidth = this.$refs.scrollCont.offsetWidth
      if (scrollContWidth > scrollWrapWidth) {
        if (this.left + 120 < 0) {
          this.left += 120
        } else {
          this.left = 0
        }
      }
    },
    arrowRight() {
      const scrollWrapWidth = this.$refs.scrollWrap.offsetWidth
      const scrollContWidth = this.$refs.scrollCont.offsetWidth
      if (scrollContWidth > scrollWrapWidth) {
        if ((Math.abs(this.left) <= (scrollContWidth - scrollWrapWidth)) && !this.rightEnd) {
          this.left -= 120
        }
      }
    },
    scrollToCurTag(tar) {
      const scrollWrapWidth = this.$refs.scrollWrap.offsetWidth
      const tarWidth = tar.offsetWidth + 10
      const tarLeft = tar.offsetLeft
      if (tarLeft < -1 * this.left) {
        // 激活的标签导航在左边
        this.left = -tarLeft
      } else if (tarLeft + tarWidth > scrollWrapWidth) {
        // 激活的标签导航在右边
        this.left = -(tarLeft + tarWidth - scrollWrapWidth)
      }
    },
    panelCommand(command) {
      if (command === 'all') {
        this.$store.commit('sysTab/REMOVE_ALL_TAB')
        this.$router.push('/')
      } else if (command === 'other') {
        this.$store.commit('sysTab/REMOVE_OTHER_TAB', this.$route)
      }
    }
  }
}
</script>
