<template>
  <el-table v-loading="isLoading" :data="itemList" border>
    <el-table-column prop="loginTime" label="登录时间" align="center" width="170">
      <template #default="scope">
        {{ $utils.formatDate(scope.row.loginTime) }}
      </template>
    </el-table-column>
    <el-table-column prop="ipaddr" label="ip地址" align="center" width="130" show-overflow-tooltip />
    <el-table-column prop="loginLocation" label="登录地点" align="center" show-overflow-tooltip />
    <el-table-column prop="browser" label="浏览器" align="center" show-overflow-tooltip />
    <el-table-column prop="os" label="操作系统" align="center" show-overflow-tooltip />
    <el-table-column prop="status" label="登录状态" align="center">
      <template #default="scope">
        <el-tag v-if="scope.row.status===0" type="success">成功</el-tag>
        <el-tag v-if="scope.row.status===1" type="danger">失败</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="msg" label="消息提示" align="center" show-overflow-tooltip />
  </el-table>
  <Pagination
    v-model:page="queryParams.currentPage"
    v-model:limit="queryParams.pageSize"
    :total="itemCount"
    @change="handleGetList"
  />
</template>

<script setup lang="ts" name="LogLogin">
import { DEFAULT_PAGE_SIZE } from '@/config/constantValues'
import SystemService from '@/api/system'

interface ListItem {
  loginTime: string
  status: number
}

const queryParams = reactive({
  pageSize: DEFAULT_PAGE_SIZE,
  currentPage: 1,
})
const isLoading = ref(false)
const itemList = ref<ListItem[]>([])
const itemCount = ref(0)

const handleGetList = async () => {
  try {
    isLoading.value = true
    const { data } = await SystemService.getAccountLoginLog<ListItem>(queryParams)
    itemList.value = data.rows
    itemCount.value = data.count
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

handleGetList()
</script>
