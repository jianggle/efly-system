<template>
  <div class="app-tabbar">
    <HeaderTabWrapper ref="scrollBar">
      <router-link
        v-for="(x, index) in Array.from(tagNavList)"
        :key="index"
        :ref="'tag-'+index"
        :to="x.path"
        :class="{'app-tabbar-item': true, 'cur': isActive(x)}"
      >
        <span>
          {{ x.title }}
          <i
            v-if="x.path!=='/dashboard'"
            class="el-icon-close"
            @click.prevent.stop="handleRemove(x, index)"
          />
        </span>
      </router-link>
    </HeaderTabWrapper>
  </div>
</template>

<script>
import HeaderTabWrapper from './HeaderTabWrapper.vue'
export default {
  name: 'HeaderTab',
  components: {
    HeaderTabWrapper
  },
  computed: {
    tagNavList() {
      return this.$store.state.sysTab.openedPages
    }
  },
  watch: {
    $route() {
      this.handleAdd()
    }
  },
  mounted() {
    this.handleAdd()
  },
  methods: {
    isActive(item) {
      return item.path === this.$route.fullPath
    },
    handleAdd() {
      this.$store.dispatch('sysTab/addTab', this.$route)
      this.scrollToCurTag()
    },
    handleRemove(item, index) {
      this.$store.commit('sysTab/REMOVE_TAB', item)
      if (!this.isActive(item)) return
      if (index) {
        this.$router.push(this.tagNavList[index - 1].path)
      } else {
        if (this.tagNavList.length) {
          this.$router.push(this.tagNavList[index].path)
        } else {
          this.$router.push('/')
        }
      }
    },
    scrollToCurTag() {
      this.$nextTick(() => {
        for (const item in this.$refs) {
          if (item.indexOf('tag-') !== 0) continue
          const { to, $el } = this.$refs[item]
          if (to === this.$route.fullPath) {
            this.$refs.scrollBar.scrollToCurTag($el)
            break
          }
        }
      })
    }
  }
}
</script>
