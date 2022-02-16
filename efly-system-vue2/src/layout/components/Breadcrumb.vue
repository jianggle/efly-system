<template>
  <el-breadcrumb separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levels" :key="item.path">
        <span v-if="item.redirect==='no' || index==levels.length-1">{{ item.meta.title }}</span>
        <router-link v-else :to="item.path">{{ item.meta.title }}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'Breadcrumb',
  data() {
    return {
      levels: []
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
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      if (matched.length) {
        const first = matched[0]
        if (first.path !== '/dashboard') {
          matched = [
            { path: '/dashboard', meta: { title: '首页' }},
            ...matched
          ]
        }
      }
      this.levels = matched
    }
  }
}
</script>
