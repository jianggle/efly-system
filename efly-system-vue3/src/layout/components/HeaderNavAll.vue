<template>
  <el-menu
    mode="horizontal"
    :collapse-transition="false"
    :default-active="$route.path"
    :background-color="variables.MENU_BG"
    :text-color="variables.MENU_TEXT_COLOR"
  >
    <MenuItem v-for="(x, index) in allMenus" :key="index" :item="x" />
  </el-menu>
</template>

<script setup lang="ts" name="HeaderNavAll">
import variables from '@/assets/style/variables.module.scss'
import useUserStore from '@/store/modules/user'
import MenuItem from './MenuItem.vue'

const userStore = useUserStore()

const allMenus = computed(() => userStore.allVisibleMenu)
</script>
