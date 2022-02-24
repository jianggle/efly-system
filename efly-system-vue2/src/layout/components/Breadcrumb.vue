<template>
  <el-breadcrumb separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levels" :key="index">
        <span v-if="!item.path || index==levels.length-1">{{ item.title }}</span>
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
      levels: []
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
      const levels = result.filter(item => !!item && item.title !== '首页')
      levels.unshift({ path: '/dashboard', title: '首页' })
      this.levels = levels
    }
  }
}
</script>
