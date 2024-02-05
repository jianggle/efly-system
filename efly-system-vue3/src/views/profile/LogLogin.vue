<template>
  <el-table v-loading="isLoading" :data="itemList" border>
    <el-table-column prop="loginTime" label="登录时间" width="170" align="center">
      <template #default="scope">
        {{ $utils.formatDate(scope.row.loginTime) }}
      </template>
    </el-table-column>
    <el-table-column prop="ipaddr" label="ip地址" width="140" align="center" show-overflow-tooltip />
    <el-table-column prop="loginLocation" label="登录地点" min-width="100" align="center" show-overflow-tooltip />
    <el-table-column prop="browser" label="浏览器" align="center" show-overflow-tooltip />
    <el-table-column prop="os" label="操作系统" min-width="100" align="center" show-overflow-tooltip />
    <el-table-column prop="status" label="登录状态" width="100" align="center">
      <template #default="scope">
        <el-tag v-if="scope.row.status === 0" type="success">成功</el-tag>
        <el-tag v-if="scope.row.status === 1" type="danger">失败</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="msg" label="消息提示" min-width="100" align="center" show-overflow-tooltip />
  </el-table>
  <Pagination
    v-model:page="pageInfo.currentPage"
    v-model:limit="pageInfo.pageSize"
    :total="itemCount"
    @change="handleGetList"
  />
</template>

<script setup lang="ts">
import { system_account_loginlog } from '@/api/system'
import useList from '@/hooks/useList'

interface ListItem {
  loginTime: string
  status: number
}

const { pageInfo, isLoading, itemList, itemCount, handleGetList } = useList<ListItem[]>({
  api: system_account_loginlog,
})
</script>
