<template>
  <div :class="{'show':show}" class="header-search">
    <SvgIcon
      name="search"
      class-name="search-icon"
      @click.stop="onToggle()"
    />
    <el-select
      ref="searchEl"
      v-model="search"
      class="header-search-select"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search"
      @change="onChange"
    >
      <el-option
        v-for="item in options"
        :key="item.path"
        :value="item"
        :label="item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
import menuJumpMixin from '../mixins/menuJump'
export default {
  name: 'HeaderSearch',
  mixins: [menuJumpMixin],
  data() {
    return {
      search: '',
      options: [],
      searchPool: [],
      show: false,
      fuse: undefined
    }
  },
  computed: {
    routes() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    routes() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    searchPool(list) {
      this.initFuse(list)
    },
    show(value) {
      if (value) {
        document.body.addEventListener('click', this.onClose)
      } else {
        document.body.removeEventListener('click', this.onClose)
      }
    }
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    onToggle() {
      this.show = !this.show
      if (this.show) {
        this.$refs.searchEl && this.$refs.searchEl.focus()
      }
    },
    onClose() {
      this.$refs.searchEl && this.$refs.searchEl.blur()
      this.options = []
      this.show = false
    },
    onChange(val) {
      this.onMenuJump(val.path)
      this.search = ''
      this.options = []
      this.$nextTick(() => {
        this.show = false
      })
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          // { name: 'title', weight: 0.7 },
          // { name: 'path', weight: 0.3 },
          { name: 'title', weight: 1 }
        ]
      })
    },
    generateRoutes(routes, prefixTitle = []) {
      let res = []
      for (const router of routes) {
        if (router.hidden) continue
        const data = {
          path: router.path,
          title: [...prefixTitle]
        }
        if (router.meta && router.meta.title && router.meta.isMenu) {
          data.title = [...data.title, router.meta.title]
          if (router.redirect !== 'no') {
            res.push(data)
          }
        }
        if (router.children) {
          const tempRoutes = this.generateRoutes(router.children, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    querySearch(query) {
      if (query !== '') {
        this.options = this.fuse.search(query).map(item => item.item)
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    :deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
