<template>
  <TableCard>
    <template #search>
      <el-form ref="queryForm" :model="queryParams" inline>
        <el-form-item prop="ipaddr">
          <el-input v-model.trim="queryParams.ipaddr" clearable placeholder="登录ip" />
        </el-form-item>
        <el-form-item prop="userName">
          <el-input v-model.trim="queryParams.userName" clearable placeholder="登录账号" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery()">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table v-loading="isLoading" :data="itemList" border>
      <el-table-column align="center" prop="token" label="会话编号" min-width="200" show-overflow-tooltip />
      <el-table-column align="center" prop="userName" label="登录账号" min-width="100" />
      <el-table-column align="center" prop="ipaddr" label="ip地址" width="130" show-overflow-tooltip />
      <el-table-column align="center" prop="loginLocation" label="登录地点" min-width="100" show-overflow-tooltip />
      <el-table-column align="center" prop="browser" label="浏览器" min-width="100" show-overflow-tooltip />
      <el-table-column align="center" prop="os" label="操作系统" min-width="100" show-overflow-tooltip />
      <el-table-column align="center" label="登录时间" width="160">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.loginTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="120" fixed="right">
        <template slot-scope="scope">
          <el-link
            v-if="$auth.hasPermit(['system:user:forceLogout'])"
            type="danger"
            icon="el-icon-delete"
            @click="onForceLogout(scope.row)"
          >强制退出</el-link>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.currentPage"
      :total="itemCount"
      @change="handleGetList"
    />
  </TableCard>
</template>

<script>
import { user_online_list, user_online_remove } from '@/api/system'
import { DEFAULT_PAGE_SIZE } from '@/config/constantValues'
export default {
  name: 'SystemUserOnline',
  data() {
    return {
      queryParams: {
        pageSize: DEFAULT_PAGE_SIZE,
        currentPage: 1,
        ipaddr: '',
        userName: '',
      },
      isLoading: false,
      itemList: [],
      itemCount: 0,
    }
  },
  created() {
    this.onQuery()
  },
  methods: {
    async handleGetList() {
      try {
        this.isLoading = true
        const { data } = await user_online_list(this.queryParams)
        this.itemList = data.rows
        this.itemCount = data.count
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    onQuery() {
      this.queryParams.currentPage = this.$options.data().queryParams.currentPage
      this.handleGetList()
    },
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.onQuery()
    },
    onSuccess(msg) {
      this.handleGetList()
      this.$modal.msgSuccess(`${msg || '操作'}成功`)
    },
    async onForceLogout(row) {
      try {
        await this.$modal.confirm(`确认要将该账号“${row.userName}”强制退出吗？`)
        this.isLoading = true
        await user_online_remove({
          token: row.token
        })
        this.onSuccess()
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
