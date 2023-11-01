<template>
  <el-breadcrumb separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="index">
        <span v-if="!item.path || index==levelList.length-1">{{ item.title }}</span>
        <router-link v-else :to="item.path">{{ item.title }}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { treeFindPath } from '@/utils/treeTool'

interface ListItem {
  path: string
  title: string
}

const route = useRoute()
const levelList = ref<ListItem[]>([])

const allMenus = computed(() => {
  return useUserStore().routes
})

const getBreadcrumb = () => {
  const result = treeFindPath(allMenus.value, 'meta', (item: ListItem) => item.path === route.path)
  const items = result.filter(item => !!item && item.title !== '首页')
  items.unshift({ path: '/dashboard', title: '首页' })
  levelList.value = items
}

watch(route, () => {
  getBreadcrumb()
})

getBreadcrumb()
</script>
