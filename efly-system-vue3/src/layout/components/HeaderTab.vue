<template>
  <div class="app-tabbar">
    <div class="app-tabbar-inner">
      <div class="app-tabbar-icon" :class="{gray:left==0}" @click="onLeft()">
        <el-icon><DArrowLeft /></el-icon>
      </div>
      <div ref="outerRef" class="app-tabbar-main" @wheel.prevent="onScroll">
        <div ref="innerRef" class="app-tabbar-content" :style="{left: left + 'px'}">
          <router-link
            v-for="(tab, index) in tabList"
            :key="tab.path"
            :to="tab.path"
            :class="{'app-tabbar-item': true, 'cur': isActive(tab)}"
          >
            <span class="item-inner">
              {{ tab.title }}
              <el-icon
                v-if="!isAffix(tab)"
                class="icon-close"
                @click.prevent.stop="handleRemove(tab, index)"
              >
                <Close />
              </el-icon>
            </span>
          </router-link>
        </div>
      </div>
      <div class="app-tabbar-icon" :class="{gray:rightEnd}" @click="onRight()">
        <el-icon><DArrowRight /></el-icon>
      </div>
      <el-dropdown class="app-tabbar-tool" :teleported="false" trigger="click" @command="onCommand">
        <div class="app-tabbar-icon">
          <el-icon><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="refresh">刷新</el-dropdown-item>
            <el-dropdown-item command="maximize">最大化</el-dropdown-item>
            <el-dropdown-item command="other" divided>关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sortable from 'sortablejs'
import { type RouteRecordRaw } from 'vue-router'
import { DArrowLeft, DArrowRight, ArrowDown, Close } from '@element-plus/icons-vue'
import useAppStore from '@/store/modules/app'
import useTabStore, { type TabItem } from '@/store/modules/tab'
import useUserStore from '@/store/modules/user'

const refreshCurrentPage: Function = inject('refresh') as Function

const wheelSpeed = 30
const itemAvgWidth = 120

const outerRef = ref<HTMLElement>()
const innerRef = ref<HTMLElement>()

const left = ref(0)
const rightEnd = ref(true)

const appStore = useAppStore()
const tabStore = useTabStore()
const route = useRoute()
const router = useRouter()

const tabList = computed(() => tabStore.visitedTabs)
const allRoutes = computed(() => useUserStore().routes)

watch(route, () => {
  handleAdd()
})

onMounted(() => {
  initTabs()
  handleAdd()
  initDragSort()
})

function isActive(tab: TabItem) {
  return tab.path === route.fullPath
}
function isAffix(tab: TabItem) {
  return tab.affix === true
}

function filterAffixTabs(routes: RouteRecordRaw[]) {
  let tabs: TabItem[] = []
  routes.forEach(route => {
    if (route.meta && route.meta.title && route.meta.affix === true) {
      tabs.push({
        path: route.path,
        title: String(route.meta.title),
        affix: true
      })
    }
    if (route.children) {
      const tempTabs = filterAffixTabs(route.children)
      if (tempTabs.length > 0) {
        tabs = [...tabs, ...tempTabs]
      }
    }
  })
  return tabs
}
function initTabs() {
  const affixTabs = filterAffixTabs(allRoutes.value)
  tabStore.visitedTabs = [...affixTabs]
}

function initDragSort() {
  Sortable.create(document.querySelector('.app-tabbar-content') as HTMLElement, {
    draggable: '.app-tabbar-item',
    animation: 300,
    onEnd({ newIndex, oldIndex }) {
      tabStore.changeSort(newIndex as number, oldIndex as number)
    }
  })
}

function handleAdd() {
  tabStore.addTab(route)
  scrollToCurTab()
}
function handleRemove(tab: TabItem, index: number) {
  tabStore.removeTab(tab)
  if (!isActive(tab)) {
    scrollToCurTab()
    return
  }
  if (index > 0) {
    router.push(tabList.value[index - 1].path)
  } else {
    if (tabList.value.length) {
      router.push(tabList.value[index].path)
    } else {
      router.push('/dashboard')
    }
  }
}
function onCommand(command: string) {
  if (command === 'all') {
    tabStore.removeAllTab().then(() => {
      if (route.meta && route.meta.affix) {
        scrollToCurTab()
      } else {
        const len = tabList.value.length
        router.push(len > 0 ? tabList.value[len - 1].path : '/dashboard')
      }
    })
  } else if (command === 'other') {
    tabStore.removeOtherTab(route).then((res) => {
      if (res) {
        scrollToCurTab()
      }
    })
  } else if (command === 'refresh') {
    const activeTab = tabList.value.find(item => item.path === route.fullPath)
    setTimeout(() => {
      activeTab?.name && tabStore.removeKeepAliveName(activeTab.name)
      refreshCurrentPage(false)
      nextTick(() => {
        activeTab?.name && tabStore.addKeepAliveName(activeTab.name)
        refreshCurrentPage(true)
      })
    }, 0)
  } else if (command === 'maximize') {
    appStore.toggleMaximize(true)
  }
}

function scrollToCurTab() {
  nextTick(() => {
    const items = document.querySelectorAll('.app-tabbar-item')
    for (const item of Array.from(items)) {
      const itemUrl = (item.getAttribute('href') || '').replace('#/', '/')
      if (route.fullPath === itemUrl) {
        scrollToTab(item as HTMLElement)
        break
      }
    }
  })
}
function scrollToTab(tar: HTMLElement) {
  const outerWidth = outerRef.value!.offsetWidth
  const innerWidth = innerRef.value!.offsetWidth
  if (innerWidth > outerWidth) {
    const tarWidth = tar.offsetWidth + 10
    const tarLeft = tar.offsetLeft
    if (tarLeft < -1 * left.value) {
      // 激活的标签导航在左边
      left.value = -tarLeft
    } else if (tarLeft + tarWidth > outerWidth) {
      // 激活的标签导航在右边
      left.value = -(tarLeft + tarWidth - outerWidth)
    }
  } else {
    left.value = 0
  }
}

watch(left, () => {
  const outerWidth = outerRef.value!.offsetWidth
  const innerWidth = innerRef.value!.offsetWidth
  if (innerWidth > outerWidth) {
    if (Math.abs(left.value) >= (innerWidth - outerWidth)) {
      rightEnd.value = true
    } else {
      rightEnd.value = false
    }
  } else {
    rightEnd.value = true
  }
})
function onScroll(e: WheelEvent) {
  const outerWidth = outerRef.value!.offsetWidth
  const innerWidth = innerRef.value!.offsetWidth
  if (innerWidth > outerWidth) {
    // 统一不同浏览器下wheel事件的滚动值
    // chrome/FF/Edge/IE11/IE10/IE9
    // e.deltaY > 0 即鼠标滚轮向下滚动，则该条向右滚动，left值变负
    const scrollSpace = e.deltaY > 0 ? -1 * wheelSpeed : wheelSpeed
    if (e.deltaY > 0) {
      if (Math.abs(left.value + scrollSpace) <= (innerWidth - outerWidth)) {
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
  const outerWidth = outerRef.value!.offsetWidth
  const innerWidth = innerRef.value!.offsetWidth
  if (innerWidth > outerWidth) {
    if (left.value + itemAvgWidth < 0) {
      left.value += itemAvgWidth
    } else {
      left.value = 0
    }
  }
}
function onRight() {
  const outerWidth = outerRef.value!.offsetWidth
  const innerWidth = innerRef.value!.offsetWidth
  if (innerWidth > outerWidth) {
    if ((Math.abs(left.value) <= (innerWidth - outerWidth)) && !rightEnd.value) {
      left.value -= itemAvgWidth
    }
  }
}
</script>
