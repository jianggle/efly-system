<template>
  <div class="app-sidebar" :class="{'nologo': isNoLogo}">
    <TheLogo />
    <el-scrollbar>
      <el-menu
        :collapse="isCollapsed"
        :collapse-transition="false"
        :default-active="activeMenu"
      >
        <MenuItem
          v-for="x in sidebarVisibleMenu"
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
export default {
  name: 'Sidebar',
  components: {
    TheLogo,
    MenuItem
  },
  computed: {
    ...mapState({
      isCollapsed: state => !state.app.sidebar.opened,
      isNoLogo: state => !state.app.setting.sidebarLogo,
    }),
    ...mapGetters(['sidebarVisibleMenu']),
    activeMenu() {
      return this.$route.fullPath
    }
  }
}
</script>
