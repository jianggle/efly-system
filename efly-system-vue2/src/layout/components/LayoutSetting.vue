<template>
  <div class="setting-drawer-container">
    <el-divider content-position="left">导航模式</el-divider>
    <div class="setting-item setting-nav-mode">
      <template v-for="(tip, mode) in navModes">
        <el-tooltip :key="mode" :content="tip">
          <li :class="{[mode]:true, 'active':navMode === mode}" @click="navMode=mode">
            <div></div>
            <div></div>
            <div class="select-icon">
              <i class="el-icon-check"></i>
            </div>
          </li>
        </el-tooltip>
      </template>
    </div>
    <el-divider content-position="left">主题颜色</el-divider>
    <div class="setting-item setting-theme">
      <template v-for="(color, index) in themeColors">
        <li :key="index" :style="{backgroundColor: color}" @click="activeThemeColor=color">
          <i v-if="activeThemeColor===color" class="el-icon-check"></i>
        </li>
      </template>
    </div>
    <el-divider content-position="left">布局尺寸</el-divider>
    <el-radio-group class="setting-item" v-model="activeThemeSize">
      <el-radio v-for="(item, index) in sizeOptions" :key="index" :label="item.value">
        {{ item.label }}
      </el-radio>
    </el-radio-group>
    <el-divider content-position="left">界面显示</el-divider>
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
    <el-divider/>
    <el-button size="small" type="primary" plain icon="el-icon-document-add" @click="onSave">保存配置</el-button>
    <el-button size="small" plain icon="el-icon-refresh" @click="onReset">重置配置</el-button>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'LayoutSetting',
  data() {
    return {
      navModes: {
        'app-nav-left': '左侧菜单模式',
        'app-nav-leftop': '左侧+顶部菜单模式',
        'app-nav-top': '顶部菜单模式',
      },
      themeColors: [
        '#409EFF', '#f5222d', '#fa541c', '#13c2c2',
        '#11a983', '#52c41a', '#eb2f96', '#722ed1',
      ],
      sizeOptions: [
        { label: 'Default', value: 'default' },
        { label: 'Medium', value: 'medium' },
        { label: 'Small', value: 'small' },
        { label: 'Mini', value: 'mini' }
      ]
    }
  },
  computed: {
    navMode: {
      get() {
        return this.$store.state.sysLayout.navMode
      },
      set(val) {
        this.updateLayout({ key: 'navMode', val })
      }
    },
    activeThemeColor: {
      get() {
        return this.$store.state.sysLayout.theme
      },
      set(val) {
        this.updateLayout({ key: 'theme', val })
      }
    },
    activeThemeSize: {
      get() {
        return this.$store.state.sysLayout.size
      },
      set(val) {
        this.updateLayout({ key: 'size', val })
      }
    },
    tagsView: {
      get() {
        return this.$store.state.sysLayout.tagsView
      },
      set(val) {
        this.updateLayout({ key: 'tagsView', val })
      }
    },
    fixedHeader: {
      get() {
        return this.$store.state.sysLayout.fixedHeader
      },
      set(val) {
        this.updateLayout({ key: 'fixedHeader', val })
      }
    },
    sidebarLogo: {
      get() {
        return this.$store.state.sysLayout.sidebarLogo
      },
      set(val) {
        this.updateLayout({ key: 'sidebarLogo', val })
      }
    },
    dynamicTitle: {
      get() {
        return this.$store.state.sysLayout.dynamicTitle
      },
      set(val) {
        this.updateLayout({ key: 'dynamicTitle', val })
      }
    },
  },
  methods: {
    ...mapMutations({
      updateLayout: 'sysLayout/UPDATE_LAYOUT'
    }),
    onSave() {
      this.$store.dispatch('sysLayout/saveLayout')
    },
    onReset() {
      this.$store.dispatch('sysLayout/resetLayout')
    }
  }
}
</script>

<style lang="scss">
.setting-drawer-container {
  padding: 16px 24px 24px;

  .el-divider__text {
    font-size: 16px;
  }

  .el-radio {
    margin-right: 0;
  }
  .el-radio__label {
    padding-left: 0;
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
        top: 24%;
        left: 50%;
        margin-left: -15px;
        color: var(--theme-color);
        font-weight: 700;
        font-size: 30px;
        display: none;
      }

      &.active {
        border: 2px solid var(--theme-color);
        box-sizing: border-box;
        .select-icon {
          display: block;
        }
      }
    }
  }

  .setting-theme {
    li {
      list-style: none;
      width: 20px;
      height: 20px;
      border-radius: 2px;
      cursor: pointer;
      color: #fff;
      text-align: center;
    }
  }

  .setting-item {
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
