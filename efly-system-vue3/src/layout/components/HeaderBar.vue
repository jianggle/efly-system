<template>
  <div class="app-header">
    <template v-if="appStore.setting.navMode === 'app-nav-top'">
      <TheLogo />
      <HeaderNavAll />
    </template>
    <template v-else>
      <div class="sidebar-btn" @click="appStore.toggleSidebar()">
        <el-icon>
          <Fold v-if="appStore.sidebar.opened" />
          <Expand v-else />
        </el-icon>
      </div>
      <HeaderNavRoot v-if="appStore.setting.navMode === 'app-nav-leftop'" />
      <Breadcrumb v-else />
    </template>
    <div class="right-box">
      <HeaderSearch class="right-menu-item" />
      <div class="right-menu-item">
        <HeaderScreenfull />
      </div>
      <el-dropdown class="right-menu-item avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar class="user-avatar" :src="userAvatar">
            {{ userName }}
          </el-avatar>
          <el-icon class="el-icon-caret-bottom">
            <CaretBottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/profile">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <el-dropdown-item v-if="AppConfig.enableSetting" @click="settingVisible = true">
              <span>布局设置</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="onLogout()">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-drawer v-model="settingVisible" :size="360" title="布局设置" append-to-body direction="rtl">
      <SettingPanel />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { Expand, Fold, CaretBottom } from '@element-plus/icons-vue'
import AppConfig from '@/config'
import useAppStore from '@/store/modules/app'
import useUserStore from '@/store/modules/user'

import TheLogo from './TheLogo.vue'
import HeaderNavAll from './HeaderNavAll.vue'
import HeaderNavRoot from './HeaderNavRoot.vue'
import Breadcrumb from './Breadcrumb.vue'
import HeaderSearch from './HeaderSearch.vue'
import HeaderScreenfull from './HeaderScreenfull.vue'
import SettingPanel from './SettingPanel.vue'

const appStore = useAppStore()
const userStore = useUserStore()

const userAvatar = computed(() => userStore.info.avatar)
const userName = computed(() => userStore.info.name)

const settingVisible = computed({
  get() {
    return appStore.settingPanelVisible
  },
  set(val) {
    appStore.settingPanelVisible = val
  },
})

const onLogout = () => {
  userStore.logout().then(() => {
    location.reload()
  })
}
</script>
