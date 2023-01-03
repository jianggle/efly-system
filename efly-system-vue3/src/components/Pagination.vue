<template>
  <el-pagination
    hide-on-single-page
    background
    :layout="layout"
    :page-sizes="pageSizes"
    v-model:page-size="pageSize"
    v-model:currentPage="currentPage"
    :total="total"
    style="padding: 10px"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts" name="Pagination">
const props = withDefaults(defineProps<{
  total: number
  page?: number
  limit?: number
  pageSizes?: number[]
  layout?: string
}>(), {
  page: 1,
  limit: 10,
  pageSizes: () => [10, 20, 30, 50],
  layout: 'total, sizes, prev, pager, next, jumper',
})

const emit = defineEmits(['change', 'update:page', 'update:limit'])

const currentPage = computed({
  get: () => props.page,
  set(val) {
    emit('update:page', val)
  },
})
const pageSize = computed({
  get: () => props.limit,
  set(val) {
    emit('update:limit', val)
  },
})

const handleSizeChange = (val: number) => {
  emit('change', { page: currentPage.value, limit: val })
}
const handleCurrentChange = (val: number) => {
  emit('change', { page: val, limit: pageSize.value })
}
</script>
