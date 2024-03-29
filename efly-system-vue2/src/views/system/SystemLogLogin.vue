<template>
  <TableCard>
    <template #search>
      <el-form ref="queryForm" :model="queryParams" inline>
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
            value-format="timestamp"
            :default-time="['00:00:00', '23:59:59']"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery()">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <el-table v-loading="isLoading" :data="itemList" border>
      <el-table-column align="center" prop="loginId" label="访问编号" width="100" />
      <el-table-column align="center" label="访问时间" width="160">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.loginTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="userName" label="用户账号" />
      <el-table-column align="center" prop="ipaddr" label="ip地址" width="130" show-overflow-tooltip />
      <el-table-column align="center" prop="loginLocation" label="登录地点" show-overflow-tooltip />
      <el-table-column align="center" prop="browser" label="浏览器" show-overflow-tooltip />
      <el-table-column align="center" prop="os" label="操作系统" show-overflow-tooltip />
      <el-table-column align="center" prop="status" label="登录状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="success">成功</el-tag>
          <el-tag v-if="scope.row.status === 1" type="danger">失败</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="msg" label="消息提示" show-overflow-tooltip />
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
import { login_log_list } from '@/api/system'
import { DEFAULT_PAGE_SIZE, DEFAULT_FIRST_PAGE } from '@/config/constantValues'
export default {
  name: 'SystemLogLogin',
  data() {
    return {
      queryParams: {
        pageSize: DEFAULT_PAGE_SIZE,
        currentPage: DEFAULT_FIRST_PAGE,
        status: '',
        keyword: '',
        timeRange: [],
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
        const { timeRange, ...params } = this.queryParams
        params.timeRange = Array.isArray(timeRange) ? timeRange.join(',') : ''
        const { data } = await login_log_list(params)
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
  },
}
</script>
