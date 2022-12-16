<template>
  <TableCard>
    <template #search>
      <el-form ref="queryForm" :model="queryParams" inline>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" clearable placeholder="状态">
            <el-option :value="0" label="正常" />
            <el-option :value="1" label="已停用" />
          </el-select>
        </el-form-item>
        <el-form-item prop="keyword">
          <el-input v-model.trim="queryParams.keyword" clearable placeholder="账号/姓名/手机号码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery()">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset('queryForm')">重置</el-button>
          <template v-if="$auth.hasPermit(['system:user:add'])">
            <el-button type="primary" icon="el-icon-plus" @click="onEdit('add')">添加</el-button>
          </template>
        </el-form-item>
      </el-form>
    </template>
    <el-table v-loading="isLoading" :data="itemList" border>
      <el-table-column prop="userId" label="用户编号" width="100" align="center" />
      <el-table-column prop="userName" label="用户账号" min-width="120" />
      <el-table-column prop="realName" label="用户姓名" min-width="120" />
      <el-table-column prop="phone" label="手机号码" width="120" align="center" />
      <el-table-column prop="roleName" label="角色" min-width="200" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status===0" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status===1" type="danger">已停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="160" align="center">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="table-operate-cell" min-width="140" fixed="right">
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
    <Pagination
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.currentPage"
      :total="itemCount"
      @change="handleGetList"
    />
    <UserEdit
      v-model="editVisible"
      :is-add="editType === 'add'"
      :reshow="editReshow"
      @ok="onSuccess"
    />
  </TableCard>
</template>

<script>
import { user_list, user_remove } from '@/api/system'
import { DEFAULT_PAGE_SIZE } from '@/config/constantValues'
import UserEdit from './components/UserEdit.vue'
export default {
  name: 'SystemUser',
  components: {
    UserEdit
  },
  data() {
    return {
      queryParams: {
        pageSize: DEFAULT_PAGE_SIZE,
        currentPage: 1,
        status: '',
        keyword: '',
      },
      isLoading: false,
      itemList: [],
      itemCount: 0,
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
          item.roleName = String((item.role || []).map(item => item.roleName))
          return item
        })
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
    onEdit(type, row) {
      this.editType = type
      this.editReshow = row || {}
      this.editVisible = true
    },
    onSuccess(msg) {
      this.editVisible = false
      this.handleGetList()
      this.$modal.msgSuccess(`${msg || '操作'}成功`)
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
