<template>
  <el-menu mode="horizontal" :collapse-transition="false" :default-active="$route.path">
    <MenuItem v-for="x in allMenus" :key="x.path" :item="x" />
  </el-menu>
</template>

<script>
import MenuItem from './MenuItem.vue'
export default {
  name: 'HeaderNavAll',
  components: {
    MenuItem,
  },
  computed: {
    allMenus() {
      return this.$store.getters.allVisibleMenu
    },
  },
}
</script>
