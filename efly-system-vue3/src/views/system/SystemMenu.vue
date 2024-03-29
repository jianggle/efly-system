<template>
  <TableCard>
    <template #table-header>
      <el-button :icon="Sort" @click="toggleExpandAll()">展开/折叠</el-button>
      <el-button :icon="Refresh" @click="handleQuery()">刷新</el-button>
      <template v-if="$auth.hasPermit(['system:menu:add'])">
        <el-button type="primary" :icon="Plus" @click="handleEdit('add')">添加</el-button>
      </template>
    </template>
    <el-table
      v-if="refreshTable"
      v-loading="isLoading"
      :data="itemList"
      border
      row-key="menuId"
      :default-expand-all="isExpandAll"
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
            @focus="tempOrderNumber = scope.row.orderNum"
            @blur="handleOrder(scope.row, $event)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="permit" label="权限标识" min-width="100" show-overflow-tooltip />
      <el-table-column prop="path" label="路由地址" min-width="100" show-overflow-tooltip />
      <el-table-column prop="component" label="组件路径" min-width="100" show-overflow-tooltip />
      <el-table-column prop="isActivated" label="状态" width="100" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.isActivated === 0" type="success">正常</el-tag>
          <el-tag v-if="scope.row.isActivated === 1" type="danger">未生效</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="170" align="center">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="scope">
          <template v-if="$auth.hasPermit(['system:menu:modify'])">
            <el-button type="primary" :icon="Edit" link @click="handleEdit('modify', scope.row)">修改</el-button>
          </template>
          <template v-if="$auth.hasPermit(['system:menu:add'])">
            <el-button type="primary" :icon="DocumentCopy" link @click="handleEdit('template_add', scope.row)">
              复制
            </el-button>
            <template v-if="scope.row.menuType === 'M' || scope.row.menuType === 'C'">
              <el-button type="primary" :icon="Plus" link @click="handleEdit('add', scope.row)">添加</el-button>
            </template>
          </template>
          <template v-if="$auth.hasPermit(['system:menu:delete'])">
            <el-button type="danger" :icon="Delete" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <SystemMenuEdit
      v-if="editVisible"
      v-model:visible="editVisible"
      :scene="editType"
      :types="menuTypes"
      :reshow="editReshow"
      :menu-tree="parentTree"
      @ok="onSuccess"
    />
  </TableCard>
</template>

<script setup lang="ts">
import { Sort, Refresh, Plus, Edit, Delete, DocumentCopy } from '@element-plus/icons-vue'
import modal from '@/plugins/modal'
import { system_menu_list, system_menu_remove, system_menu_order } from '@/api/system/menu'
import { treeFilter } from '@/utils/treeTool'
import useList from '@/hooks/useList'
import useOrder from '@/hooks/useOrder'
import SystemMenuEdit from '@/components/system/SystemMenuEdit.vue'

defineOptions({
  name: 'SystemMenu',
})

type EditType = 'add' | 'modify' | 'template_add'
interface ListItem {
  menuId: number
  menuName: string
  menuType: string
  orderNum: number
}

const menuTypes = reactive({
  M: '目录',
  C: '菜单',
  A: '按钮',
  L: '外链',
})
const refreshTable = ref(true)
const isExpandAll = ref(false)

const { isLoading, itemList, handleGetList, handleQuery } = useList<ListItem[]>({
  api: system_menu_list,
  isPageable: false,
  resultCallback: (data) => {
    const validMenus = treeFilter(data, (node: ListItem) => node.menuType === 'M' || node.menuType === 'C')
    parentTree.value = [{ menuId: 0, menuName: '根目录', children: validMenus }]
  },
})

const { tempOrderNumber, handleOrder } = useOrder(system_menu_order, 'menuId', 'orderNum', () => {
  onSuccess('操作成功')
})

const parentTree = ref<any[]>([])
const editVisible = ref(false)
const editType = ref<EditType>('add')
const editReshow = ref({})

function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

function onSuccess(msg: string) {
  modal.msgSuccess(msg)
  handleGetList()
}

async function handleDelete(row: ListItem) {
  try {
    await modal.confirm(`菜单功能尤为重要，请谨慎操作。确认要删除名为“${row.menuName}”的菜单吗？`)
    isLoading.value = true
    await system_menu_remove({ menuId: row.menuId })
    onSuccess('删除成功')
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

function handleEdit(type: EditType, row?: ListItem) {
  editType.value = type
  let reshowObj: any = {}
  if (['modify', 'template_add'].includes(type)) {
    reshowObj = row
  }
  if (type === 'add' && row) {
    reshowObj = {
      parentId: row.menuId,
    }
  }
  editReshow.value = reshowObj
  editVisible.value = true
}
</script>
