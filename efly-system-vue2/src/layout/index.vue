<template>
  <div class="app-wrapper" :class="wrapperClass">
    <!-- 左侧导航栏 -->
    <Sidebar v-if="sidebarVisible" />
    <!-- 右侧主体内容 -->
    <div class="app-main">
      <!-- 头部区域 -->
      <div class="app-header-box">
        <HeaderBar />
        <!-- 标签栏 -->
        <HeaderTab v-if="tabVisible" />
      </div>
      <!-- 主体区域 -->
      <div style="overflow:hidden;">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <router-view />
          </keep-alive>
        </transition>
      </div>
    </div>
    <!-- 水印组件 -->
    <BgWatermark v-if="isWatermark" />
    <!-- 重新登录弹框 -->
    <el-dialog
      :visible="$store.state.user.showLogin"
      :show-close="false"
      title="重新登录"
      width="420px"
      append-to-body
      center
    >
      <LoginForm :re-login="true" />
    </el-dialog>
  </div>
</template>

<script>
import LoginForm from '@/components/LoginForm.vue'
import Sidebar from './components/Sidebar.vue'
import HeaderBar from './components/HeaderBar.vue'
import HeaderTab from './components/HeaderTab.vue'
import BgWatermark from './components/BgWatermark.vue'
import { setThemeColor } from '@/utils/theme'
import { layoutSettings, watermark } from '@/config'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Layout',
  components: {
    LoginForm,
    Sidebar,
    HeaderBar,
    HeaderTab,
    BgWatermark,
  },
  data() {
    return {
      isWatermark: watermark
    }
  },
  computed: {
    ...mapGetters([
      'sidebarOpened',
      'device',
    ]),
    ...mapState({
      sidebarVisible: state => state.sysLayout.navMode !== 'app-nav-top',
      tabVisible: state => state.sysLayout.tagsView,
      cachedViews: state => state.sysTab.cachedPages,
      themeColor: state => state.sysLayout.theme,
      themeSize: state => state.sysLayout.size,
    }),
    wrapperClass() {
      return {
        'app-sidebar-collapse': !this.sidebarOpened,
        'app-has-headerTab': this.tabVisible,
        'app-header-fixed': this.$store.state.sysLayout.fixedHeader,
        [this.$store.state.sysLayout.navMode]: true,
      }
    }
  },
  watch: {
    themeColor(val) {
      document.querySelector('html').setAttribute('style', `--theme-color:${val}`)
      setThemeColor(val)
    },
    themeSize(val) {
      this.setThemeSize(val)
    },
    $route() {
      if (this.device === 'mobile' && this.sidebarOpened) {
        this.$store.commit('app/CLOSE_SIDEBAR')
      }
    }
  },
  created() {
    document.querySelector('html').setAttribute('style', `--theme-color:${this.themeColor}`)
    // 如果不是默认主题颜色，则设置用户自定义的颜色
    if (layoutSettings.theme !== this.themeColor) {
      setThemeColor(this.themeColor)
    }
    if (layoutSettings.size !== this.themeSize) {
      this.setThemeSize(this.themeSize)
    }
  },
  beforeMount() {
    window.addEventListener('resize', this.$utils.debounce(this.listenResize, 30))
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.listenResize)
  },
  mounted() {
    const isMobile = this.checkMobile()
    if (isMobile) {
      this.$store.commit('app/UPDATE_DEVICE', 'mobile')
      this.$store.commit('app/CLOSE_SIDEBAR')
    }
  },
  methods: {
    checkMobile() {
      const rect = document.body.getBoundingClientRect()
      // refer to Bootstrap's responsive design
      return rect.width - 1 < 992
    },
    listenResize() {
      if (!document.hidden) {
        const isMobile = this.checkMobile()
        const newDevice = isMobile ? 'mobile' : 'desktop'
        if (this.device !== newDevice) {
          this.$store.commit('app/UPDATE_DEVICE', newDevice)
        }
        if (isMobile) {
          this.sidebarOpened && this.$store.commit('app/CLOSE_SIDEBAR')
        } else {
          !this.sidebarOpened && this.$store.commit('app/OPEN_SIDEBAR')
        }
      }
    },
    setThemeSize(size) {
      this.$ELEMENT.size = size
      // 被缓存的页面需要重新渲染才会生效
      this.$store.commit('sysTab/REMOVE_ALL_CACHED_PAGES')
      const { fullPath } = this.$route
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath
        })
      })
    }
  }
}
</script>
