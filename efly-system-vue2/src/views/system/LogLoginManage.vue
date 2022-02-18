<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
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
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery()">查询</el-button>
            <el-button icon="el-icon-refresh" @click="onReset('queryForm')">重置</el-button>
            <template v-if="$auth.hasPermit(['system:log:login_reset'])">
              <el-button type="danger" plain icon="el-icon-delete" @click="onClearLog()">清空</el-button>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="isLoading" :data="itemList">
        <el-table-column align="center" prop="loginId" label="访问编号" />
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
            <el-tag v-if="scope.row.status===0" type="success">成功</el-tag>
            <el-tag v-if="scope.row.status===1" type="danger">失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="msg" label="消息提示" show-overflow-tooltip />
      </el-table>
      <el-pagination
        hide-on-single-page
        background
        layout="total, prev, pager, next, jumper"
        :page-size="queryParams.pageSize"
        :current-page="queryParams.currentPage"
        :total="itemsCount"
        @current-change="onPageChange"
      />
    </el-card>
  </div>
</template>

<script>
import { login_log_list, login_log_reset } from '@/api/systemLog'
export default {
  name: 'LogLoginManage',
  data() {
    return {
      queryParams: {
        pageSize: 12,
        currentPage: 1,
        status: '',
        keyword: '',
        timeRange: [],
      },
      isLoading: false,
      itemList: [],
      itemsCount: 0,
    }
  },
  created() {
    this.onQuery()
  },
  methods: {
    async handleGetList() {
      try {
        this.isLoading = true
        const lastParams = this.$utils.deepClone(this.queryParams)
        const [time_start = '', time_end = ''] = this.queryParams.timeRange || []
        lastParams.time_start = time_start ? +new Date(time_start) : ''
        lastParams.time_end = time_end ? +new Date(time_end) + 24 * 60 * 60 * 1000 : ''
        delete lastParams.timeRange
        const { data } = await login_log_list(lastParams)
        this.itemList = data.rows
        this.itemsCount = data.count
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    onQuery() {
      this.queryParams.currentPage = 1
      this.handleGetList()
    },
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.onQuery()
    },
    onPageChange(page) {
      this.queryParams.currentPage = page
      this.handleGetList()
    },
    onSuccess(msg) {
      this.handleGetList()
      this.$message.success(`${msg || '操作'}成功`)
    },
    async onClearLog() {
      try {
        await this.$confirm('确认要清空所有登录日志吗？', '温馨提示', {
          type: 'warning'
        })
        this.isLoading = true
        await login_log_reset()
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
