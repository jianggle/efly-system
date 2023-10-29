<template>
  <el-breadcrumb separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="index+item.title">
        <span v-if="!item.path || index==levelList.length-1">{{ item.title }}</span>
        <router-link v-else :to="item.path">{{ item.title }}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { treeFindPath } from '@/utils/treeTool'
export default {
  name: 'Breadcrumb',
  data() {
    return {
      levelList: []
    }
  },
  computed: {
    allMenus() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      const result = treeFindPath(this.allMenus, 'meta', (item) => item.path === this.$route.path)
      const items = result.filter(item => !!item && item.title !== '首页')
      items.unshift({ path: '/dashboard', title: '首页' })
      this.levelList = items
    }
  }
}
</script>
