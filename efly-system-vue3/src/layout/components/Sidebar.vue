<template>
  <div class="app-sidebar" :class="{ nologo: isNoLogo }">
    <TheLogo />
    <el-scrollbar>
      <el-menu :collapse="isCollapse" :collapse-transition="false" :default-active="activeMenu">
        <MenuItem v-for="x in menuList" :key="x.path" :item="x" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import TheLogo from './TheLogo.vue'
import MenuItem from './MenuItem.vue'

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const isNoLogo = computed(() => !appStore.setting.sidebarLogo)
const isCollapse = computed(() => !appStore.sidebar.opened)
const activeMenu = computed(() => route.fullPath)
const menuList = computed(() => userStore.sidebarVisibleMenu)
</script>
