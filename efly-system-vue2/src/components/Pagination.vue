<template>
  <el-pagination
    hide-on-single-page
    background
    :layout="layout"
    :page-size.sync="pageSize"
    :current-page.sync="currentPage"
    :total="total"
    style="padding:10px;"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 10
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next, jumper'
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
      this.$emit('change', {
        page: this.currentPage,
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
