<template>
  <div class="app-tabbar-inner">
    <div class="app-tabbar-icon" :class="{gray:left==0}" @click="onLeft()">
      <el-icon><DArrowLeft /></el-icon>
    </div>
    <div ref="wrapperRef" class="app-tabbar-main" @wheel.prevent="onScroll">
      <div ref="innerRef" class="app-tabbar-content" :style="{left: left + 'px'}">
        <slot />
      </div>
    </div>
    <div class="app-tabbar-icon" :class="{gray:rightEnd}" @click="onRight()">
      <el-icon><DArrowRight /></el-icon>
    </div>
    <el-dropdown class="app-tabbar-tool" @command="onCommand">
      <div class="app-tabbar-icon">
        <el-icon><ArrowDown /></el-icon>
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

<script setup lang="ts" name="HeaderTabPanel">
import { DArrowLeft, DArrowRight, ArrowDown } from '@element-plus/icons-vue'
import useTabStore from '@/store/modules/tab'

const wheelSpeed = 30
const itemAvgWidth = 120

const wrapperRef = ref<HTMLElement>()
const innerRef = ref<HTMLElement>()

const tabStore = useTabStore()
const route = useRoute()
const router = useRouter()

const left = ref(0)
const rightEnd = ref(true)

watch(left, () => {
  const scrollWrapWidth = wrapperRef.value!.offsetWidth
  const scrollContWidth = innerRef.value!.offsetWidth
  if (scrollContWidth > scrollWrapWidth) {
    if (Math.abs(left.value) >= (scrollContWidth - scrollWrapWidth)) {
      rightEnd.value = true
    } else {
      rightEnd.value = false
    }
  } else {
    rightEnd.value = true
  }
})

function onScroll(e: any) {
  const scrollWrapWidth = wrapperRef.value!.offsetWidth
  const scrollContWidth = innerRef.value!.offsetWidth
  if (scrollContWidth > scrollWrapWidth) {
    // 统一不同浏览器下wheel事件的滚动值
    // chrome/FF/Edge/IE11/IE10/IE9
    // e.deltaY > 0 即鼠标滚轮向下滚动，则该条向右滚动，left值变负
    const scrollSpace = e.deltaY > 0 ? -1 * wheelSpeed : wheelSpeed
    if (e.deltaY > 0) {
      if (Math.abs(left.value + scrollSpace) <= (scrollContWidth - scrollWrapWidth)) {
        left.value += scrollSpace
      } else {
        rightEnd.value = true
      }
    } else {
      if (left.value + scrollSpace < 0) {
        left.value += scrollSpace
      } else {
        left.value = 0
      }
    }
  }
}

function onLeft() {
  const scrollWrapWidth = wrapperRef.value!.offsetWidth
  const scrollContWidth = innerRef.value!.offsetWidth
  if (scrollContWidth > scrollWrapWidth) {
    if (left.value + itemAvgWidth < 0) {
      left.value += itemAvgWidth
    } else {
      left.value = 0
    }
  }
}

function onRight() {
  const scrollWrapWidth = wrapperRef.value!.offsetWidth
  const scrollContWidth = innerRef.value!.offsetWidth
  if (scrollContWidth > scrollWrapWidth) {
    if ((Math.abs(left.value) <= (scrollContWidth - scrollWrapWidth)) && !rightEnd.value) {
      left.value -= itemAvgWidth
    }
  }
}

function onCommand(command: string) {
  if (command === 'all') {
    tabStore.removeAllTab().then(() => {
      router.push('/dashboard')
    })
  } else if (command === 'other') {
    tabStore.removeOtherTab(route)
  }
}

function scrollToTab(tar: any) {
  const scrollWrapWidth = wrapperRef.value!.offsetWidth
  const tarWidth = tar.offsetWidth + 10
  const tarLeft = tar.offsetLeft
  if (tarLeft < -1 * left.value) {
    // 激活的标签导航在左边
    left.value = -tarLeft
  } else if (tarLeft + tarWidth > scrollWrapWidth) {
    // 激活的标签导航在右边
    left.value = -(tarLeft + tarWidth - scrollWrapWidth)
  }
}

defineExpose({
  scrollToTab
})
</script>
