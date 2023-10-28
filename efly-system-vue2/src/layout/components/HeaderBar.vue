<template>
  <div class="app-header">
    <template v-if="navMode==='app-nav-top'">
      <TheLogo />
      <HeaderNavAll />
    </template>
    <template v-else>
      <div class="sidebar-btn" @click="onSwitchSidebar()">
        <i :class="sidebarOpened ? 'el-icon-s-fold' : 'el-icon-s-unfold'" />
      </div>
      <HeaderNavRoot v-if="navMode==='app-nav-leftop'" />
      <Breadcrumb v-else />
    </template>
    <div class="right-box">
      <template v-if="device!=='mobile'">
        <HeaderSearch class="right-menu-item" />
        <div class="right-menu-item">
          <HeaderScreenfull />
        </div>
      </template>
      <el-dropdown class="right-menu-item avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar class="user-avatar" :src="userAvatar">
            {{ userName }}
          </el-avatar>
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/profile">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <el-dropdown-item @click.native="settingVisible = true">
              <span>布局设置</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click.native="logout()">
              <span style="display:block;">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-drawer :visible.sync="settingVisible" :size="360" title="布局设置" append-to-body direction="rtl">
      <SettingPanel />
    </el-drawer>
  </div>
</template>

<script>
import TheLogo from './TheLogo.vue'
import HeaderNavAll from './HeaderNavAll.vue'
import HeaderNavRoot from './HeaderNavRoot.vue'
import Breadcrumb from './Breadcrumb.vue'
import HeaderSearch from './HeaderSearch.vue'
import HeaderScreenfull from './HeaderScreenfull.vue'
import SettingPanel from './SettingPanel.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HeaderBar',
  components: {
    TheLogo,
    HeaderNavAll,
    HeaderNavRoot,
    Breadcrumb,
    HeaderSearch,
    HeaderScreenfull,
    SettingPanel
  },
  computed: {
    ...mapGetters([
      'navMode',
      'sidebarOpened',
      'device',
      'userName',
      'userAvatar',
    ]),
    settingVisible: {
      get() {
        return this.$store.state.app.settingPanelVisible
      },
      set(val) {
        this.$store.commit('app/updateSettingPanelVisible', val)
      }
    },
  },
  methods: {
    onSwitchSidebar() {
      this.$store.commit('app/toggleSidebar')
    },
    logout() {
      this.$store.dispatch('user/logout').then(() => {
        location.reload()
      })
    }
  }
}
</script>
