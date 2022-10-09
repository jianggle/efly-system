<template>
  <div class="app-sidebar" :class="{'nologo': isNoLogo}">
    <TheLogo />
    <el-scrollbar>
      <el-menu
        :collapse="isCollapsed"
        :collapse-transition="false"
        :default-active="activeMenu"
        :background-color="variables.MENU_BG"
        :text-color="variables.MENU_TEXT_COLOR"
        :active-text-color="$store.state.sysLayout.theme"
      >
        <MenuItem
          v-for="x in sidebarMenu"
          :key="x.path"
          :item="x"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import TheLogo from './TheLogo.vue'
import MenuItem from './MenuItem.vue'
import variables from '@/assets/style/variables.module.scss'
export default {
  name: 'Sidebar',
  components: {
    TheLogo,
    MenuItem
  },
  computed: {
    variables() {
      return variables
    },
    ...mapState({
      isCollapsed: state => !state.app.sidebarOpened,
      isNoLogo: state => !state.sysLayout.sidebarLogo,
    }),
    ...mapGetters(['sidebarMenu']),
    activeMenu() {
      return this.$route.fullPath
    }
  }
}
</script>
