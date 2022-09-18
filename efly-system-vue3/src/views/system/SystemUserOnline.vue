<template>
  <MainCard>
    <template #header>
      <el-form ref="queryFormRef" :model="queryParams" inline>
        <el-form-item prop="ipaddr">
          <el-input v-model.trim="queryParams.ipaddr" clearable placeholder="登录ip" />
        </el-form-item>
        <el-form-item prop="userName">
          <el-input v-model.trim="queryParams.userName" clearable placeholder="登录账号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="onQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table v-loading="isLoading" :data="itemList">
      <el-table-column prop="token" label="会话编号" align="center" show-overflow-tooltip />
      <el-table-column prop="userName" label="登录账号" align="center" />
      <el-table-column prop="ipaddr" label="ip地址" align="center" width="130" show-overflow-tooltip />
      <el-table-column prop="loginLocation" label="登录地点" align="center" show-overflow-tooltip />
      <el-table-column prop="browser" label="浏览器" align="center" show-overflow-tooltip />
      <el-table-column prop="os" label="操作系统" align="center" show-overflow-tooltip />
      <el-table-column prop="loginTime" label="登录时间" align="center" width="170">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.loginTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <template v-if="$auth.hasPermit(['system:user:forceLogout'])">
            <el-button type="danger" :icon="Delete" link @click="onForceLogout(scope.row)">强制退出</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="queryParams.currentPage"
      v-model:limit="queryParams.pageSize"
      :total="itemCount"
      @change="handleGetList"
    />
  </MainCard>
</template>

<script setup lang="ts" name="SystemUserOnline">
import { Search, Refresh, Delete } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import modal from '@/plugins/modal'
import { DEFAULT_PAGE_SIZE } from '@/config/constantValues'
import SystemService from '@/api/system'

interface ListItem {
  token: string
  userName: string
}

const queryFormRef = ref<FormInstance>()
const queryParams = reactive({
  pageSize: DEFAULT_PAGE_SIZE,
  currentPage: 1,
  ipaddr: '',
  userName: '',
})
const isLoading = ref(false)
const itemList = ref([])
const itemCount = ref(0)

async function handleGetList() {
  try {
    isLoading.value = true
    const { data } = await SystemService.getOnlineUser(queryParams)
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

async function onForceLogout(row: ListItem) {
  try {
    await modal.confirm(`确认要将该账号“${row.userName}”强制退出吗？`)
    isLoading.value = true
    await SystemService.removeOnlineUser({
      token: row.token
    })
    handleGetList()
    modal.msgSuccess('操作成功')
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

onQuery()
</script>
