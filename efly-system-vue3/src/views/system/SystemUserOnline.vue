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
          <el-button type="primary" :icon="Search" @click="handleQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table v-loading="isLoading" :data="itemList" border>
      <el-table-column prop="token" label="会话编号" min-width="200" align="center" show-overflow-tooltip />
      <el-table-column prop="userName" label="登录账号" min-width="100" align="center" />
      <el-table-column prop="ipaddr" label="ip地址" align="center" width="140" show-overflow-tooltip />
      <el-table-column prop="loginLocation" label="登录地点" min-width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="browser" label="浏览器" min-width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="os" label="操作系统" min-width="100" align="center" show-overflow-tooltip />
      <el-table-column prop="loginTime" label="登录时间" align="center" width="170">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.loginTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" fixed="right">
        <template #default="scope">
          <template v-if="$auth.hasPermit(['system:user:forceLogout'])">
            <el-button type="danger" :icon="Delete" link @click="onForceLogout(scope.row)">强制退出</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="pageInfo.currentPage"
      v-model:limit="pageInfo.pageSize"
      :total="itemCount"
      @change="handleGetList"
    />
  </MainCard>
</template>

<script setup lang="ts" name="SystemUserOnline">
import { Search, Refresh, Delete } from '@element-plus/icons-vue'
import modal from '@/plugins/modal'
import { system_onlineuser_list, system_onlineuser_remove } from '@/api/system'
import useList from '@/hooks/useList'

interface ListItem {
  token: string
  userName: string
}

const queryParams = reactive({
  ipaddr: '',
  userName: '',
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
  api: system_onlineuser_list,
  params: queryParams,
})

async function onForceLogout(row: ListItem) {
  try {
    await modal.confirm(`确认要将该账号“${row.userName}”强制退出吗？`)
    isLoading.value = true
    await system_onlineuser_remove({
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
</script>
