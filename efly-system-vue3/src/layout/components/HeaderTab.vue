<template>
  <div class="app-tabbar">
    <HeaderTabPanel ref="panelRef">
      <router-link
        v-for="(tab, index) in tabList"
        :key="index"
        :to="tab.path"
        :class="{'app-tabbar-item': true, cur: isActive(tab)}"
      >
        <span>
          {{ tab.title }}
          <el-icon v-if="!isAffix(tab)" @click.prevent.stop="handleRemove(tab, index)">
            <Close />
          </el-icon>
        </span>
      </router-link>
    </HeaderTabPanel>
  </div>
</template>

<script setup lang="ts" name="HeaderTab">
import { Close } from '@element-plus/icons-vue'
import useTabStore, { TabItem } from '@/store/modules/tab'
import HeaderTabPanel from './HeaderTabPanel.vue'

const panelRef = ref<InstanceType<typeof HeaderTabPanel>>()

const tabStore = useTabStore()
const route = useRoute()
const router = useRouter()

const tabList = computed(() => tabStore.visitedTabs)

watch(route, () => {
  handleAdd()
})

onMounted(() => {
  handleAdd()
})

function isActive(tab: TabItem) {
  return tab.path === route.fullPath
}
function isAffix(tab: TabItem) {
  return tab.path === '/dashboard'
}

function handleAdd() {
  tabStore.addTab(route)
  scrollToCurTab()
}

function handleRemove(tab: TabItem, index: number) {
  tabStore.removeTab(tab)
  if (!isActive(tab)) return
  if (index > 0) {
    router.push(tabList.value[index - 1].path)
  } else {
    if (tabList.value.length) {
      router.push(tabList.value[index].path)
    } else {
      router.push('/')
    }
  }
}

function scrollToCurTab() {
  nextTick(() => {
    const items = document.querySelectorAll('.app-tabbar-item')
    for (const item of Array.from(items)) {
      const itemUrl = (item.getAttribute('href') || '').replace('#/', '/')
      if (route.fullPath === itemUrl) {
        panelRef.value!.scrollToTab(item)
        break
      }
    }
  })
}
</script>
