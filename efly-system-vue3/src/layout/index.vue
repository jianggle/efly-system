<template>
  <div class="app-wrapper" :class="wrapperClass">
    <Maximize v-if="isMaximize" />
    <Sidebar v-if="sidebarVisible" />
    <div class="app-main">
      <div class="app-header-box">
        <HeaderBar />
        <HeaderTab v-if="appStore.setting.tagsView" />
      </div>
      <div class="app-main-view">
        <router-view v-slot="{ Component, route }">
          <transition appear name="fade-transform" mode="out-in">
            <keep-alive :include="tabStore.cachedTabs">
              <component v-if="isRouterShow" :is="Component" :key="route.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
      <div class="app-main-copyright">
        <p>
          <span>&copy; 2021 - {{ $utils.formatDate(Date.now(), 'YYYY') }}&nbsp;&nbsp;</span>
          <a href="https://github.com/jianggle/efly-system" target="_blank">{{AppConfig.siteName}}</a>
          <span>&nbsp;版权所有.&nbsp;&nbsp;By&nbsp;</span>
          <a href="https://jiangdesheng.com/" target="_blank">德创致胜</a>
        </p>
      </div>
    </div>
    <BgWatermark v-if="isWatermark" />
    <el-dialog
      :append-to-body="true"
      :center="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :draggable="true"
      :destroy-on-close="true"
      :model-value="userStore.showLogin"
      :show-close="false"
      title="重新登录"
      width="420px"
    >
      <LoginForm :re-login="true" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import AppConfig from '@/config'
import useAppStore from '@/store/modules/app'
import useTabStore from '@/store/modules/tab'
import useUserStore from '@/store/modules/user'
import LoginForm from '@/components/LoginForm.vue'
import Maximize from './components/Maximize.vue'
import Sidebar from './components/Sidebar.vue'
import HeaderBar from './components/HeaderBar.vue'
import HeaderTab from './components/HeaderTab.vue'
import BgWatermark from './components/BgWatermark.vue'
import { setThemeStyle } from '@/utils/theme'

defineOptions({
  name: 'Layout'
})

const appStore = useAppStore()
const tabStore = useTabStore()
const userStore = useUserStore()

// 注入刷新页面方法
const isRouterShow = ref(true)
const refreshCurrentPage = (val: boolean) => (isRouterShow.value = val)
provide('refresh', refreshCurrentPage)

// 监听当前页面是否最大化，动态添加 class
const isMaximize = computed(() => {
  return appStore.maximize
})
watch(
  isMaximize,
  (val) => {
    const app = document.getElementById('app') as HTMLElement
    if (val) {
      app.classList.add('main-maximize')
    } else {
      app.classList.remove('main-maximize')
    }
  },
  { immediate: true }
)

const wrapperClass = computed(() => {
  return {
    'app-sidebar-collapse': !appStore.sidebar.opened,
    'app-has-headerTab': appStore.setting.tagsView,
    'app-header-fixed': appStore.setting.fixedHeader,
    [appStore.setting.navMode]: true,
  }
})

const sidebarVisible = computed(() => {
  return appStore.setting.navMode !== 'app-nav-top'
})

const isWatermark = computed(() => {
  return AppConfig.watermark
})

const themeColor = computed(() => {
  return appStore.setting.theme
})
watch(themeColor, (val) => {
  setThemeStyle(val)
})

onMounted(() => {
  // 如果不是默认主题颜色，则设置为用户自定义的颜色
  if (themeColor.value !== AppConfig.setting.theme) {
    setThemeStyle(themeColor.value)
  }
})
</script>
