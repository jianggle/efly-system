<template>
  <div class="app-sidebar" :class="{ nologo: isNoLogo }">
    <TheLogo />
    <el-scrollbar>
      <el-menu
        :collapse="isCollapse"
        :collapse-transition="false"
        :default-active="activeMenu"
        :background-color="variables.MENU_BG"
        :text-color="variables.MENU_TEXT_COLOR"
        :active-text-color="appStore.setting.theme"
      >
        <MenuItem v-for="x in menuList" :key="x.path" :item="x" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts" name="Sidebar">
import variables from '@/assets/style/variables.module.scss'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'
import TheLogo from './TheLogo.vue'
import MenuItem from './MenuItem.vue'

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const isNoLogo = computed(() => !appStore.setting.sidebarLogo)
const isCollapse = computed(() => !appStore.sidebar.open)
const activeMenu = computed(() => route.fullPath)
const menuList = computed(() => userStore.sidebarVisibleMenu)
</script>
