<template>
  <el-menu mode="horizontal" :collapse-transition="false" :default-active="$route.path">
    <MenuItem v-for="(x, index) in allMenus" :key="index" :item="x" />
  </el-menu>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import MenuItem from './MenuItem.vue'

const $route = useRoute()

const userStore = useUserStore()

const allMenus = computed(() => userStore.allVisibleMenu)
</script>
