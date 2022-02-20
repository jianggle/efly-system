<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <el-button icon="el-icon-refresh" @click="onQuery()">刷新</el-button>
        <template v-if="$auth.hasPermit(['system:role:add'])">
          <el-button type="primary" icon="el-icon-plus" @click="onEdit('add')">添加</el-button>
        </template>
      </div>
      <el-table v-loading="isLoading" :data="itemList" border>
        <el-table-column prop="roleId" label="角色编号" min-width="80" />
        <el-table-column prop="roleName" label="角色名称" min-width="120" />
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
        <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
        <el-table-column label="操作" class-name="table-operate-cell" min-width="140">
          <template #default="scope">
            <template v-if="scope.row.isSystem===1">
              <el-link
                v-if="$auth.hasPermit(['system:role:modify'])"
                type="primary"
                icon="el-icon-edit"
                @click="onEdit('modify', scope.row)"
              >修改</el-link>
              <el-popconfirm
                v-if="$auth.hasPermit(['system:role:delete'])"
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
    </el-card>
    <RoleEdit
      v-model="editVisible"
      :is-add="editType === 'add'"
      :reshow="editReshow"
      @ok="onSuccess"
    />
  </div>
</template>

<script>
import { role_list, role_remove } from '@/api/systemRole'
import RoleEdit from './components/RoleEdit.vue'
export default {
  name: 'RoleManage',
  components: {
    RoleEdit
  },
  data() {
    return {
      isLoading: false,
      itemList: [],
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
        const { data } = await role_list()
        this.itemList = data
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    onQuery() {
      this.handleGetList()
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
    async onRemove({ roleId }) {
      try {
        this.isLoading = true
        await role_remove({ roleId })
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
