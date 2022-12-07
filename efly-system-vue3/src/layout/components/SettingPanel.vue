<template>
  <div class="setting-drawer-container">
    <el-divider>布局模式</el-divider>
    <div class="setting-item setting-nav-mode">
      <el-tooltip v-for="(tip, mode) in navModes" :key="mode" :content="tip">
        <li :class="{[mode]:true, 'active':navMode === mode}" @click="navMode=mode">
          <div /><div />
          <div class="select-icon">
            <el-icon><Check/></el-icon>
          </div>
        </li>
      </el-tooltip>
    </div>
    <br>
    <el-divider>主题颜色</el-divider>
    <div class="setting-item setting-theme">
      <li v-for="(color, index) in themeColors" :key="index" :style="{backgroundColor: color}" @click="activeThemeColor=color">
        <el-icon v-if="activeThemeColor===color"><Check/></el-icon>
      </li>
    </div>
    <br>
    <el-divider>界面显示</el-divider>
    <div class="setting-item">
      <span>固定Header</span>
      <el-switch v-model="fixedHeader" />
    </div>
    <div class="setting-item">
      <span>侧边栏Logo</span>
      <el-switch v-model="sidebarLogo" />
    </div>
    <div class="setting-item">
      <span>动态标题</span>
      <el-switch v-model="dynamicTitle" />
    </div>
    <div class="setting-item">
      <span>开启标签栏</span>
      <el-switch v-model="tagsView" />
    </div>
    <el-divider />
    <div class="setting-footer">
      <el-button size="default" type="primary" plain :icon="DocumentAdd" @click="onSave">保存配置</el-button>
      <el-button size="default" plain :icon="Refresh" @click="onReset">重置配置</el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="SettingPanel">
import { Check, DocumentAdd, Refresh } from '@element-plus/icons-vue'
import useAppStore from '@/store/modules/app'

const appStore = useAppStore()

const navModes = reactive({
  'app-nav-left': '左侧菜单模式',
  'app-nav-leftop': '左侧+顶部菜单模式',
  'app-nav-top': '顶部菜单模式',
})
const themeColors = ref([
  '#409EFF', '#f5222d', '#fa541c', '#13c2c2',
  '#11a983', '#52c41a', '#eb2f96', '#722ed1',
])

const navMode = computed({
  get() {
    return appStore.setting.navMode
  },
  set(val) {
    appStore.updateSetting('navMode', val)
  }
})
const activeThemeColor = computed({
  get() {
    return appStore.setting.theme
  },
  set(val) {
    appStore.updateSetting('theme', val)
  }
})
const tagsView = computed({
  get() {
    return appStore.setting.tagsView
  },
  set(val) {
    appStore.updateSetting('tagsView', val)
  }
})
const fixedHeader = computed({
  get() {
    return appStore.setting.fixedHeader
  },
  set(val) {
    appStore.updateSetting('fixedHeader', val)
  }
})
const sidebarLogo = computed({
  get() {
    return appStore.setting.sidebarLogo
  },
  set(val) {
    appStore.updateSetting('sidebarLogo', val)
  }
})
const dynamicTitle = computed({
  get() {
    return appStore.setting.dynamicTitle
  },
  set(val) {
    appStore.updateSetting('dynamicTitle', val)
  }
})

function onSave() {
  appStore.saveSetting()
}
function onReset() {
  appStore.resetSetting()
}
</script>

<style lang="scss">
.setting-drawer-container {
  padding: 0 10px;

  .el-divider--horizontal {
    margin-top: 14px;
    margin-bottom: 20px;
  }
  .el-radio {
    margin-right: 0;
  }

  .setting-nav-mode {
    li {
      position: relative;
      list-style: none;
      background-color: #f5f5f5;
      width: 30%;
      height: 70px;
      overflow: hidden;
      border-radius: 4px;
      box-shadow: 0 1px 2.5px rgba(0, 0, 0, .2);
      cursor: pointer;

      div:nth-child(1) {
        width: 24%;
        height: 100%;
        background: #1b2a47;
      }
      div:nth-child(2) {
        position: absolute;
        top: 0;
        right: 0;
        width: 76%;
        height: 24%;
        background: #fff;
        box-shadow: 0 0 1px #888;
      }

      &.app-nav-leftop {
        div:nth-child(2) {
          background: #1b2a47;
          box-shadow: none;
        }
      }
      &.app-nav-top {
        div:nth-child(1) {
          display: none;
        }
        div:nth-child(2) {
          width: 100%;
          background: #1b2a47;
          box-shadow: none;
        }
      }

      .select-icon {
        position: absolute;
        bottom: 4%;
        right: 14%;
        color: var(--el-color-primary);
        font-weight: 700;
        font-size: 30px;
        line-height: 1;
        display: none;
      }

      &.active {
        border: 2px solid var(--el-color-primary);
        box-sizing: border-box;
        .select-icon {
          display: block;
        }
      }
    }
  }

  .setting-theme {
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      list-style: none;
      width: 20px;
      height: 20px;
      border-radius: 2px;
      cursor: pointer;
      color: #fff;
    }
  }

  .setting-item {
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .setting-footer {
    .el-button {
      width: 48%;
    }
    .el-button+.el-button {
      margin-left: 4%;
    }
  }
}
</style>
