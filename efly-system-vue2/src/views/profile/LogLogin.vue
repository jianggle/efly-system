<template>
  <div>
    <el-table v-loading="isLoading" :data="itemList" border>
      <el-table-column align="center" label="登录时间" width="160">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.loginTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="ipaddr" label="ip地址" width="130" show-overflow-tooltip />
      <el-table-column align="center" prop="loginLocation" label="登录地点" show-overflow-tooltip />
      <el-table-column align="center" prop="browser" label="浏览器" show-overflow-tooltip />
      <el-table-column align="center" prop="os" label="操作系统" show-overflow-tooltip />
      <el-table-column align="center" prop="status" label="登录状态" width="100">
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
  </div>
</template>

<script>
import { user_login_log } from '@/api/system'
import { DEFAULT_PAGE_SIZE, DEFAULT_FIRST_PAGE } from '@/config/constantValues'
export default {
  name: 'UserLogLogin',
  data() {
    return {
      queryParams: {
        pageSize: DEFAULT_PAGE_SIZE,
        currentPage: DEFAULT_FIRST_PAGE,
      },
      isLoading: false,
      itemList: [],
      itemCount: 0,
    }
  },
  created() {
    this.handleGetList()
  },
  methods: {
    async handleGetList() {
      try {
        this.isLoading = true
        const { data } = await user_login_log(this.queryParams)
        this.itemList = data.rows
        this.itemCount = data.count
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
