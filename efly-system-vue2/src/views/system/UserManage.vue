<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <el-form ref="queryForm" :model="queryParams" inline>
          <el-form-item prop="status">
            <el-select v-model="queryParams.status" clearable placeholder="状态">
              <el-option :value="0" label="正常"></el-option>
              <el-option :value="1" label="已停用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="keyword">
            <el-input v-model.trim="queryParams.keyword" clearable placeholder="账号/姓名/手机号码"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery()">查询</el-button>
            <el-button icon="el-icon-refresh" @click="onReset('queryForm')">重置</el-button>
            <template v-if="$auth.hasPermit(['system:user:add'])">
              <el-button type="primary" icon="el-icon-plus" @click="onEdit('add')">添加</el-button>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="isLoading" :data="itemList" border>
        <el-table-column prop="userId" label="用户编号" min-width="80"></el-table-column>
        <el-table-column prop="userName" label="用户账号" min-width="120"></el-table-column>
        <el-table-column prop="realName" label="用户姓名" min-width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="120"></el-table-column>
        <el-table-column prop="roleName" label="角色" min-width="200"></el-table-column>
        <el-table-column label="状态" min-width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.status===0" type="success">正常</el-tag>
            <el-tag v-if="scope.row.status===1" type="danger">已停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="160">
          <template #default="scope">
            {{ $utils.formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="table-operate-cell" min-width="140">
          <template #default="scope">
            <template v-if="scope.row.isSystem===1">
              <el-link
                v-if="$auth.hasPermit(['system:user:modify'])"
                type="primary"
                icon="el-icon-edit"
                @click="onEdit('modify', scope.row)"
              >修改</el-link>
              <el-popconfirm
                v-if="$auth.hasPermit(['system:user:delete'])"
                title="确定删除吗？"
                @confirm="onRemove(scope.row)"
              >
                <template #reference>
                  <el-link type="danger" icon="el-icon-delete">删除</el-link>
                </template>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
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
    <UserEdit
      v-model="editVisible"
      :is-add="editType === 'add'"
      :reshow="editReshow"
      @ok="onSuccess"
    />
  </div>
</template>

<script>
import { user_list, user_remove } from '@/api/systemUser'
import UserEdit from './components/UserEdit.vue'
export default {
  name: 'UserManage',
  components: {
    UserEdit
  },
  data() {
    return {
      queryParams: {
        pageSize: 12,
        currentPage: 1,
        status: '',
        keyword: '',
      },
      isLoading: false,
      itemList: [],
      itemsCount: 0,
      editVisible: false,
      editType: '',
      editReshow: {},
    }
  },
  created() {
    this.onQuery()
  },
  methods: {
    async handleGetList() {
      try {
        this.isLoading = true
        const { data } = await user_list(this.queryParams)
        this.itemList = data.rows.map(item => {
          item.statusDesc = { 0: '正常', 1: '已停用' }[item.status]
          return item
        })
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
    onEdit(type, row) {
      this.editType = type
      this.editReshow = row || {}
      this.editVisible = true
    },
    onPageChange(page) {
      this.queryParams.currentPage = page
      this.handleGetList()
    },
    onSuccess(msg) {
      this.editVisible = false
      this.handleGetList()
      this.$message.success(`${msg || '操作'}成功`)
    },
    async onRemove({ userId }) {
      try {
        this.isLoading = true
        await user_remove({ userId })
        this.onSuccess('删除')
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
