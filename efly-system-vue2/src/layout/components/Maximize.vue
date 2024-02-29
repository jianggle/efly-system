<template>
  <div class="app-maximize" @click="exitMaximize">
    <i class="el-icon-close" />
  </div>
</template>

<script>
export default {
  name: 'Maximize',
  methods: {
    exitMaximize() {
      this.$store.commit('app/toggleMaximize', false)
    },
  },
}
</script>

<style lang="scss">
.app-maximize {
  position: fixed;
  top: -25px;
  right: -25px;
  z-index: 999;
  width: 52px;
  height: 52px;
  cursor: pointer;
  background-color: #909399;
  border-radius: 50%;
  opacity: 0.7;
  &:hover {
    background-color: #73767a;
  }
  > i {
    position: relative;
    top: 68%;
    left: 32%;
    font-size: 16px;
    color: #ffffff;
    transform: translate(-50%, -50%);
  }
}
</style>
