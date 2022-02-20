<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <el-button icon="el-icon-sort" @click="toggleExpandAll()">展开/折叠</el-button>
        <el-button icon="el-icon-refresh" @click="onQuery()">刷新</el-button>
        <template v-if="$auth.hasPermit(['system:menu:add'])">
          <el-button type="primary" icon="el-icon-plus" @click="onEdit('add')">添加</el-button>
        </template>
      </div>
      <el-table
        v-if="refreshTable"
        v-loading="isLoading"
        :data="itemList"
        row-key="menuId"
        :default-expand-all="isExpandAll"
        :border="true"
      >
        <el-table-column prop="menuName" label="菜单名称" width="160" show-overflow-tooltip />
        <el-table-column label="类型" width="100" align="center">
          <template #default="scope">
            {{ menuTypes[scope.row.menuType] }}
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="80" align="center">
          <template #default="scope">
            <svg-icon v-if="scope.row.icon" :name="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="80" align="center">
          <template #default="scope">
            <input
              class="table-order-input"
              type="number"
              :value="scope.row.orderNum"
              :disabled="!$auth.hasPermit(['system:menu:order'])"
              @focus="tempOrderNumber=scope.row.orderNum"
              @blur="onOrderBlur(scope.row.menuId, $event)"
            >
          </template>
        </el-table-column>
        <el-table-column prop="permit" label="权限标识" show-overflow-tooltip />
        <el-table-column prop="path" label="路由地址" show-overflow-tooltip />
        <el-table-column prop="component" label="组件路径" show-overflow-tooltip />
        <el-table-column prop="isActivated" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.isActivated===0" type="success">正常</el-tag>
            <el-tag v-if="scope.row.isActivated===1" type="danger">未生效</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="scope">
            {{ $utils.formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="table-operate-cell" width="240">
          <template #default="scope">
            <el-link
              v-if="$auth.hasPermit(['system:menu:modify'])"
              type="primary"
              icon="el-icon-edit"
              @click="onEdit('modify', scope.row)"
            >修改</el-link>
            <template v-if="$auth.hasPermit(['system:menu:add'])">
              <el-link
                type="primary"
                icon="el-icon-document-copy"
                @click="onEdit('template_add', scope.row)"
              >复制</el-link>
              <el-link
                v-if="scope.row.menuType==='M' || scope.row.menuType==='C'"
                type="primary"
                icon="el-icon-plus"
                @click="onEdit('add', scope.row)"
              >添加</el-link>
            </template>
            <el-link
              v-if="$auth.hasPermit(['system:menu:delete'])"
              type="danger"
              icon="el-icon-delete"
              @click="onRemove(scope.row)"
            >删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <MenuEdit
      v-if="editVisible"
      :visible.sync="editVisible"
      :scene="editType"
      :types="menuTypes"
      :reshow="editReshow"
      :menu-tree="parentTree"
      @ok="onSuccess"
    />
  </div>
</template>

<script>
import { menu_list, menu_modify_order, menu_remove } from '@/api/systemMenu'
import { treeFilter } from '@/utils/treeTool'
import MenuEdit from './components/MenuEdit.vue'
export default {
  name: 'MenuManage',
  components: {
    MenuEdit
  },
  data() {
    return {
      menuTypes: {
        'M': '目录',
        'C': '菜单',
        'A': '按钮',
        'G': '功能块',
        'L': '外链',
      },
      refreshTable: true,
      isExpandAll: false,
      tempOrderNumber: '',
      isLoading: false,
      itemList: [],
      parentTree: [],
      editVisible: false,
      editType: 'add',
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
        const { data } = await menu_list()
        this.itemList = data
        const validMenus = treeFilter(data, (node) => node.menuType === 'M' || node.menuType === 'C')
        this.parentTree = [{ menuId: 0, menuName: '根目录', children: validMenus }]
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
      let reshowObj = {}
      if (['modify', 'template_add'].includes(type)) {
        reshowObj = row
      }
      if (type === 'add' && row) {
        reshowObj = {
          parentId: row.menuId
        }
      }
      this.editReshow = reshowObj
      this.editVisible = true
    },
    onSuccess(msg) {
      this.editVisible = false
      this.handleGetList()
      this.$modal.msgSuccess(`${msg || '操作'}成功`)
    },
    async onRemove({ menuId, menuName }) {
      try {
        await this.$modal.confirm(`菜单功能尤为重要，请谨慎操作。确认要删除名为“${menuName}”的菜单吗？`)
        this.isLoading = true
        await menu_remove({ menuId })
        this.onSuccess('删除')
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    async onOrderBlur(id, e) {
      const val = ((e.target || e.srcElement).value + '').replace(/\s/g, '')
      if (!val || !/^\d{1,5}$/.test(val) || val * 1 === this.tempOrderNumber) {
        (e.target || e.srcElement).value = this.tempOrderNumber
      } else {
        await menu_modify_order({
          menuId: id,
          orderNum: val * 1
        })
        this.onSuccess()
      }
    }
  }
}
</script>
