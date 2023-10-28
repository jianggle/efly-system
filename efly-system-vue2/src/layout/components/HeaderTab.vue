<template>
  <div class="app-tabbar">
    <div class="app-tabbar-inner">
      <div class="app-tabbar-icon" :class="{gray:left==0}" @click="onLeft()">
        <i class="el-icon-d-arrow-left" />
      </div>
      <div ref="outerRef" class="app-tabbar-main" @wheel.prevent="onScroll">
        <div ref="innerRef" class="app-tabbar-content" :style="{left: left + 'px'}">
          <router-link
            v-for="(tab, index) in tabList"
            :key="tab.path"
            :to="tab.path"
            :class="{'app-tabbar-item': true, 'cur': isActive(tab)}"
          >
            <span class="item-inner">
              {{ tab.title }}
              <em
                v-if="!isAffix(tab)"
                class="icon-close"
                @click.prevent.stop="handleRemove(tab, index)"
              >
                <i class="el-icon-close" />
              </em>
            </span>
          </router-link>
        </div>
      </div>
      <div class="app-tabbar-icon" :class="{gray:rightEnd}" @click="onRight()">
        <i class="el-icon-d-arrow-right" />
      </div>
      <el-dropdown class="app-tabbar-tool" trigger="click" @command="onCommand">
        <div class="app-tabbar-icon">
          <i class="el-icon-arrow-down" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="refresh">刷新</el-dropdown-item>
            <el-dropdown-item command="maximize">最大化</el-dropdown-item>
            <el-dropdown-item command="other" divided>关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs'

const wheelSpeed = 30
const itemAvgWidth = 120

export default {
  name: 'HeaderTab',
  data() {
    return {
      left: 0,
      rightEnd: true
    }
  },
  computed: {
    tabList() {
      return this.$store.state.tab.visitedTabs
    },
    allRoutes() {
      return this.$store.state.user.routes
    }
  },
  watch: {
    $route() {
      this.handleAdd()
    },
    left: {
      handler() {
        const outerWidth = this.$refs.outerRef.offsetWidth
        const innerWidth = this.$refs.innerRef.offsetWidth
        if (innerWidth > outerWidth) {
          if (Math.abs(this.left) >= (innerWidth - outerWidth)) {
            this.rightEnd = true
          } else {
            this.rightEnd = false
          }
        } else {
          this.rightEnd = true
        }
      }
    }
  },
  mounted() {
    this.initTabs()
    this.handleAdd()
    this.initDragSort()
  },
  methods: {
    isActive(tab) {
      return tab.path === this.$route.fullPath
    },
    isAffix(tab) {
      return tab.affix === true
    },
    filterAffixTabs(routes) {
      let tabs = []
      routes.forEach(route => {
        if (route.meta && route.meta.title && route.meta.affix === true) {
          tabs.push({
            path: route.path,
            title: String(route.meta.title),
            affix: true
          })
        }
        if (route.children) {
          const tempTabs = this.filterAffixTabs(route.children)
          if (tempTabs.length > 0) {
            tabs = [...tabs, ...tempTabs]
          }
        }
      })
      return tabs
    },
    initTabs() {
      const affixTabs = this.filterAffixTabs(this.allRoutes)
      this.$store.commit('tab/setVisitedTabs', [...affixTabs])
    },
    initDragSort() {
      const that = this
      Sortable.create(document.querySelector('.app-tabbar-content'), {
        draggable: '.app-tabbar-item',
        animation: 300,
        onEnd({ newIndex, oldIndex }) {
          that.$store.dispatch('tab/changeSort', { newIndex, oldIndex })
        }
      })
    },
    handleAdd() {
      this.$store.dispatch('tab/addTab', this.$route)
      this.scrollToCurTab()
    },
    handleRemove(tab, index) {
      this.$store.dispatch('tab/removeTab', tab)
      if (!this.isActive(tab)) {
        this.scrollToCurTab()
        return
      }
      if (index > 0) {
        this.$router.push(this.tabList[index - 1].path)
      } else {
        if (this.tabList.length) {
          this.$router.push(this.tabList[index].path)
        } else {
          this.$router.push('/dashboard')
        }
      }
    },
    scrollToCurTab() {
      this.$nextTick(() => {
        const items = document.querySelectorAll('.app-tabbar-item')
        for (const item of Array.from(items)) {
          const itemUrl = (item.getAttribute('href') || '').replace('#/', '/')
          if (this.$route.fullPath === itemUrl) {
            this.scrollToTab(item)
            break
          }
        }
      })
    },
    scrollToTab(tar) {
      const outerWidth = this.$refs.outerRef.offsetWidth
      const innerWidth = this.$refs.innerRef.offsetWidth
      if (innerWidth > outerWidth) {
        const tarWidth = tar.offsetWidth + 10
        const tarLeft = tar.offsetLeft
        if (tarLeft < -1 * this.left) {
          // 激活的标签导航在左边
          this.left = -tarLeft
        } else if (tarLeft + tarWidth > outerWidth) {
          // 激活的标签导航在右边
          this.left = -(tarLeft + tarWidth - outerWidth)
        }
      } else {
        this.left = 0
      }
    },
    onScroll(e) {
      const outerWidth = this.$refs.outerRef.offsetWidth
      const innerWidth = this.$refs.innerRef.offsetWidth
      if (innerWidth > outerWidth) {
        // 统一不同浏览器下wheel事件的滚动值
        // chrome/FF/Edge/IE11/IE10/IE9
        // e.deltaY > 0 即鼠标滚轮向下滚动，则该条向右滚动，left值变负
        const scrollSpace = e.deltaY > 0 ? -1 * wheelSpeed : wheelSpeed
        if (e.deltaY > 0) {
          if (Math.abs(this.left + scrollSpace) <= (innerWidth - outerWidth)) {
            this.left += scrollSpace
          } else {
            this.rightEnd = true
          }
        } else {
          if (this.left + scrollSpace < 0) {
            this.left += scrollSpace
          } else {
            this.left = 0
          }
        }
      }
    },
    onLeft() {
      const outerWidth = this.$refs.outerRef.offsetWidth
      const innerWidth = this.$refs.innerRef.offsetWidth
      if (innerWidth > outerWidth) {
        if (this.left + itemAvgWidth < 0) {
          this.left += itemAvgWidth
        } else {
          this.left = 0
        }
      }
    },
    onRight() {
      const outerWidth = this.$refs.outerRef.offsetWidth
      const innerWidth = this.$refs.innerRef.offsetWidth
      if (innerWidth > outerWidth) {
        if ((Math.abs(this.left) <= (innerWidth - outerWidth)) && !this.rightEnd) {
          this.left -= itemAvgWidth
        }
      }
    },
    onCommand(command) {
      if (command === 'all') {
        this.$store.dispatch('tab/removeAllTab').then(() => {
          if (this.$route.meta && this.$route.meta.affix) {
            this.scrollToCurTab()
          } else {
            const len = this.tabList.length
            this.$router.push(len > 0 ? this.tabList[len - 1].path : '/dashboard')
          }
        })
      } else if (command === 'other') {
        this.$store.dispatch('tab/removeOtherTab', this.$route).then((res) => {
          if (res) {
            this.scrollToCurTab()
          }
        })
      } else if (command === 'refresh') {
        const { fullPath } = this.$route
        const activeTab = this.tabList.find(item => item.path === fullPath)
        activeTab.name && this.$store.commit('tab/removeKeepAliveName', activeTab.name)
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      } else if (command === 'maximize') {
        this.$store.commit('app/toggleMaximize', true)
      }
    }
  }
}
</script>
