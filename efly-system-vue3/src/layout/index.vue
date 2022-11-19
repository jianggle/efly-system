<template>
  <div class="app-wrapper" :class="wrapperClass">
    <Sidebar v-if="sidebarVisible" />
    <div class="app-main">
      <div class="app-header-box">
        <HeaderBar />
        <HeaderTab v-if="appStore.setting.tagsView" />
      </div>
      <div style="overflow: hidden">
        <router-view v-slot="{ Component, route }">
          <!-- <transition appear name="fade-transform" mode="out-in"> -->
            <keep-alive :include="tabStore.cachedTabs">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          <!-- </transition> -->
        </router-view>
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

<script setup lang="ts" name="Layout">
import AppConfig from '@/config'
import useAppStore from '@/store/modules/app'
import useTabStore from '@/store/modules/tab'
import useUserStore from '@/store/modules/user'
import LoginForm from '@/components/LoginForm.vue'
import Sidebar from './components/Sidebar.vue'
import HeaderBar from './components/HeaderBar.vue'
import HeaderTab from './components/HeaderTab.vue'
import BgWatermark from './components/BgWatermark.vue'
import { setThemeStyle } from '@/utils/theme'

const appStore = useAppStore()
const tabStore = useTabStore()
const userStore = useUserStore()

const wrapperClass = computed(() => {
  return {
    'app-sidebar-collapse': !appStore.sidebar.open,
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
