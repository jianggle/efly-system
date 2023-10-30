<template>
  <el-pagination
    hide-on-single-page
    background
    :layout="layout"
    :page-sizes="pageSizes"
    :page-size.sync="pageSize"
    :current-page.sync="currentPage"
    :total="total"
    style="padding:10px;"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
import { DEFAULT_PAGE_SIZE, DEFAULT_FIRST_PAGE } from '@/config/constantValues'
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: DEFAULT_FIRST_PAGE
    },
    limit: {
      type: Number,
      default: DEFAULT_PAGE_SIZE
    },
    pageSizes: {
      type: Array,
      default() {
        return [DEFAULT_PAGE_SIZE, 25, 50, 100]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.currentPage = DEFAULT_FIRST_PAGE
      this.$emit('change', {
        page: DEFAULT_FIRST_PAGE,
        limit: val
      })
    },
    handleCurrentChange(val) {
      this.$emit('change', {
        page: val,
        limit: this.pageSize
      })
    }
  }
}
</script>
