<template>
  <TableCard>
    <template #search>
      <el-form ref="queryFormRef" :model="queryParams" inline>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" clearable placeholder="登录状态">
            <el-option :value="0" label="成功" />
            <el-option :value="1" label="失败" />
          </el-select>
        </el-form-item>
        <el-form-item prop="keyword">
          <el-input v-model.trim="queryParams.keyword" clearable placeholder="用户账号" />
        </el-form-item>
        <el-form-item prop="timeRange">
          <el-date-picker
            v-model="queryParams.timeRange"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="x"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table v-loading="isLoading" :data="itemList" border>
      <el-table-column prop="loginId" label="访问编号" width="100" align="center" />
      <el-table-column prop="loginTime" label="访问时间" width="170" align="center">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.loginTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户账号" min-width="100" align="center" />
      <el-table-column prop="ipaddr" label="ip地址" width="140" align="center" show-overflow-tooltip />
      <el-table-column prop="loginLocation" label="登录地点" min-width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="browser" label="浏览器" align="center" show-overflow-tooltip />
      <el-table-column prop="os" label="操作系统" min-width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="status" label="登录状态" width="100" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status===0" type="success">成功</el-tag>
          <el-tag v-if="scope.row.status===1" type="danger">失败</el-tag>
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
  </TableCard>
</template>

<script setup lang="ts" name="SystemLogLogin">
import { Search, Refresh } from '@element-plus/icons-vue'
import { system_loginlog_list } from '@/api/system'
import useList from '@/hooks/useList'

interface ListItem {
  loginTime: string
  userName: string
  status: number
}

const queryParams = reactive({
  status: '',
  keyword: '',
  timeRange: [],
})
const {
  queryFormRef,
  pageInfo,
  isLoading,
  itemList,
  itemCount,
  handleGetList,
  handleQuery,
  handleReset,
} = useList<ListItem[]>({
  api: system_loginlog_list,
  params: queryParams,
  formatParams: (params) => {
    return {
      ...params,
      timeRange: Array.isArray(params.timeRange) ? params.timeRange.join(',') : ''
    }
  }
})
</script>
