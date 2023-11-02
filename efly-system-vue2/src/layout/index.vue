<template>
  <div class="app-wrapper" :class="wrapperClass">
    <Maximize v-if="isMaximize" />
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
      <div class="app-main-view">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cachedViews">
            <router-view />
          </keep-alive>
        </transition>
      </div>
      <div class="app-main-copyright">
        <p>
          <span>&copy; 2021 - {{ $utils.formatDate(Date.now(), 'YYYY') }}&nbsp;&nbsp;</span>
          <a href="https://github.com/jianggle/efly-system" target="_blank">{{ siteName }}</a>
          <span>&nbsp;版权所有.&nbsp;&nbsp;By&nbsp;</span>
          <a href="https://jiangdesheng.com/" target="_blank">德创致胜</a>
        </p>
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
import Maximize from './components/Maximize.vue'
import Sidebar from './components/Sidebar.vue'
import HeaderBar from './components/HeaderBar.vue'
import HeaderTab from './components/HeaderTab.vue'
import BgWatermark from './components/BgWatermark.vue'
import { setThemeColor } from '@/utils/theme'
import { layoutSettings, watermark, siteName } from '@/config'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Layout',
  components: {
    LoginForm,
    Maximize,
    Sidebar,
    HeaderBar,
    HeaderTab,
    BgWatermark,
  },
  data() {
    return {
      isWatermark: watermark,
      siteName,
    }
  },
  computed: {
    ...mapGetters([
      'sidebarOpened',
      'device',
    ]),
    ...mapState({
      isMaximize: state => state.app.maximize,
      sidebarVisible: state => state.app.setting.navMode !== 'app-nav-top',
      tabVisible: state => state.app.setting.tagsView,
      cachedViews: state => state.tab.cachedTabs,
      themeColor: state => state.app.setting.theme,
      themeSize: state => state.app.setting.size,
    }),
    wrapperClass() {
      return {
        'app-sidebar-collapse': !this.sidebarOpened,
        'app-has-headerTab': this.tabVisible,
        'app-header-fixed': this.$store.state.app.setting.fixedHeader,
        [this.$store.state.app.setting.navMode]: true,
      }
    }
  },
  watch: {
    themeColor(val) {
      document.querySelector('html').setAttribute('style', `--ef-theme-color:${val}`)
      setThemeColor(val)
    },
    isMaximize: {
      handler(val) {
        const app = document.getElementById('app')
        if (val) {
          app.classList.add('main-maximize')
        } else {
          app.classList.remove('main-maximize')
        }
      },
      immediate: true
    },
    themeSize(val) {
      this.setThemeSize(val)
    },
    $route() {
      if (this.device === 'mobile' && this.sidebarOpened) {
        this.$store.commit('app/closeSidebar')
      }
    }
  },
  created() {
    document.querySelector('html').setAttribute('style', `--ef-theme-color:${this.themeColor}`)
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
      this.$store.commit('app/updateDevice', 'mobile')
      this.$store.commit('app/closeSidebar')
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
          this.$store.commit('app/updateDevice', newDevice)
        }
        if (isMobile) {
          this.sidebarOpened && this.$store.commit('app/closeSidebar')
        } else {
          !this.sidebarOpened && this.$store.commit('app/openSidebar')
        }
      }
    },
    setThemeSize(size) {
      this.$ELEMENT.size = size
      // 被缓存的页面需要重新渲染才会生效
      this.$store.commit('tab/setKeepAliveName')
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
