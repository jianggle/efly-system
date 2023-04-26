<template>
  <el-menu
    mode="horizontal"
    :collapse-transition="false"
    :default-active="$route.path"
    :background-color="variables.MENU_BG_COLOR"
    :text-color="variables.MENU_TEXT_COLOR"
    :active-text-color="$store.state.sysLayout.theme"
  >
    <MenuItem
      v-for="x in allMenus"
      :key="x.path"
      :item="x"
    />
  </el-menu>
</template>

<script>
import MenuItem from './MenuItem.vue'
import variables from '@/assets/style/variables.module.scss'
export default {
  name: 'HeaderNavAll',
  components: {
    MenuItem
  },
  computed: {
    variables() {
      return variables
    },
    allMenus() {
      return this.$store.getters.permission_routes.filter(item => !item.hidden)
    }
  }
}
</script>
