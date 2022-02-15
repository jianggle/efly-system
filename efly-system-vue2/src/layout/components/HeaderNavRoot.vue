<template>
  <el-menu
    mode="horizontal"
    :collapse-transition="false"
    :default-active="activeMenu"
    :background-color="variables.MENU_BG"
    :text-color="variables.MENU_TEXT_COLOR"
    :active-text-color="$store.state.sysLayout.theme"
    @select="handleSelect"
  >
    <template v-for="(item, index) in allMenus">
      <el-menu-item :key="item.path" :index="item.path" v-if="index < visibleNumber">
        <svg-icon v-if="item.meta.icon" :name="item.meta.icon"/>
        <template #title>{{item.meta.title}}</template>
      </el-menu-item>
    </template>
    <el-submenu index="more" v-if="allMenus.length > visibleNumber">
      <template #title> >> </template>
      <template v-for="(item, index) in allMenus">
        <el-menu-item :key="item.path" :index="item.path" v-if="index >= visibleNumber">
          <svg-icon v-if="item.meta.icon" :name="item.meta.icon"/>
          <template #title>{{item.meta.title}}</template>
        </el-menu-item>
      </template>
    </el-submenu>
  </el-menu>
</template>

<script>
import { mapMutations } from 'vuex'
import { treeFindPath } from '@/utils/treeTool'
import variables from '@/assets/style/variables.scss'
import menuJumpMixin from '../mixins/menuJump'
export default {
  name: 'HeaderNavRoot',
  mixins: [ menuJumpMixin ],
  computed: {
    variables() {
      return variables
    },
    allMenus() {
      return this.$store.getters.permission_routes.filter(item => !item.hidden)
    }
  },
  data() {
    return {
      visibleNumber: 5,
      activeMenu: '',
      oldParentPath: '',
    }
  },
  watch: {
    '$route.path'(val) {
      let curParentPath = this.getActiveParentPath()
      this.activeMenu = curParentPath
      if (curParentPath && curParentPath !== this.oldParentPath) {
        this.oldParentPath = curParentPath
        this.modifySideRoutes(curParentPath)
      }
    }
  },
  created() {
    this.init()
  },
  beforeMount() {
    window.addEventListener('resize', this.$utils.debounce(this.getVisibleNumber, 30))
  },
  mounted() {
    this.getVisibleNumber()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getVisibleNumber)
    this.updateSideMenu(this.allMenus)
  },
  methods: {
    ...mapMutations({
      updateSideMenu: 'user/UPDATE_SIDEBAR_MENU'
    }),
    getVisibleNumber() {
      const width = document.body.getBoundingClientRect().width / 3;
      this.visibleNumber = parseInt(width / 100)
    },
    getActiveParentPath() {
      let arr = treeFindPath(this.allMenus, 'path', (data) => data.path === this.$route.path)
      return arr.length ? arr[0] : ''
    },
    init() {
      const curParentPath = this.getActiveParentPath()
      let tempRoutes = this.allMenus.length ? this.allMenus[0].children : []
      let tempActive = this.allMenus.length ? this.allMenus[0].path : ''
      if (curParentPath) {
        let res = this.allMenus.find(item => item.path === curParentPath)
        if (res && res.children && res.children.length) {
          tempRoutes = res.children
          tempActive = curParentPath
        }
      }
      this.updateSideMenu(tempRoutes)
      this.activeMenu = tempActive
    },
    handleSelect(index) {
      this.activeMenu = index
      this.oldParentPath = index
      this.modifySideRoutes(index)
    },
    modifySideRoutes(index) {
      let res = this.allMenus.find(item => item.path === index)
      if (res && res.children && res.children.length) {
        this.updateSideMenu(res.children)
      } else {
        this.onMenuJump(index)
      }
    }
  }
}
</script>
