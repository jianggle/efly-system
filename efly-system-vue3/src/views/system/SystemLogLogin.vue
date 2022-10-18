<template>
  <MainCard>
    <template #header>
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
          <el-button type="primary" :icon="Search" @click="onQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table v-loading="isLoading" :data="itemList">
      <el-table-column prop="loginId" label="访问编号" align="center" />
      <el-table-column prop="loginTime" label="访问时间" align="center" width="170">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.loginTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户账号" align="center" />
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
  </MainCard>
</template>

<script setup lang="ts" name="SystemLogLogin">
import { Search, Refresh } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { DEFAULT_PAGE_SIZE } from '@/config/constantValues'
import { system_loginlog_list } from '@/api/system'

interface ListItem {
  loginTime: string
  userName: string
  status: number
}

const queryFormRef = ref<FormInstance>()
const queryParams = reactive({
  pageSize: DEFAULT_PAGE_SIZE,
  currentPage: 1,
  status: '',
  keyword: '',
  timeRange: [],
})
const isLoading = ref(false)
const itemList = ref<ListItem[]>([])
const itemCount = ref(0)

async function handleGetList() {
  try {
    isLoading.value = true
    const params = {
      ...queryParams,
      timeRange: Array.isArray(queryParams.timeRange) ? queryParams.timeRange.join(',') : ''
    }
    const { data } = await system_loginlog_list<ListItem>(params)
    itemList.value = data.rows
    itemCount.value = data.count
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
function onQuery() {
  queryParams.currentPage = 1
  handleGetList()
}
function onReset() {
  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
    onQuery()
  }
}

onQuery()
</script>
