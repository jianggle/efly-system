<template>
  <div class="header-search" :class="{ 'show': showSearch }">
    <SvgIcon name="search" class-name="search-icon" @click.stop="onToggle()" />
    <el-select
      ref="selectRef"
      v-model="keywords"
      class="header-search-select"
      :default-first-option="true"
      :filterable="true"
      :remote="true"
      :remote-method="onSearch"
      placeholder="Search"
      @change="onChange"
    >
      <el-option
        v-for="(item, index) in resultList"
        :key="index"
        :value="item.path"
        :label="item.title.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
import useLinkJump from '../mixins/useLinkJump'
export default {
  name: 'HeaderSearch',
  mixins: [useLinkJump],
  data() {
    return {
      keywords: '',
      resultList: [],
      searchPool: [],
      showSearch: false,
      fuse: undefined
    }
  },
  computed: {
    originData() {
      return this.$store.getters.permission_routes
    }
  },
  watch: {
    originData() {
      this.searchPool = this.generateRoutes(this.originData)
    },
    searchPool(list) {
      this.initFuse(list)
    },
    showSearch(value) {
      if (value) {
        document.body.addEventListener('click', this.onClose)
      } else {
        document.body.removeEventListener('click', this.onClose)
      }
    }
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.originData)
  },
  methods: {
    onToggle() {
      this.showSearch = !this.showSearch
      if (this.showSearch) {
        this.$refs.selectRef && this.$refs.selectRef.focus()
      }
    },
    onClose() {
      this.$refs.selectRef && this.$refs.selectRef.blur()
      this.resultList = []
      this.showSearch = false
    },
    onChange(path) {
      this.onLinkJump(path)
      this.keywords = ''
      this.resultList = []
      this.$nextTick(() => {
        this.showSearch = false
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
    generateRoutes(pool, prefixTitle = []) {
      let res = []
      for (const route of pool) {
        if (!route.meta || !route.meta.title || !route.meta.isMenu) continue
        const data = {
          path: route.path,
          title: [...prefixTitle, route.meta.title],
        }
        if (route.redirect !== 'no') {
          res.push(data)
        }
        if (route.children) {
          const tempRoutes = this.generateRoutes(route.children, data.title)
          if (tempRoutes.length >= 1) {
            res = [...res, ...tempRoutes]
          }
        }
      }
      return res
    },
    onSearch(kwd) {
      if (kwd !== '') {
        const res = this.fuse.search(kwd)
        this.resultList = res.map(item => item.item)
      } else {
        this.resultList = []
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
