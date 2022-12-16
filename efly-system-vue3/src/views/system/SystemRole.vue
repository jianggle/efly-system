<template>
  <TableCard>
    <template #table-header>
      <el-button :icon="Refresh" @click="handleQuery()">刷新</el-button>
      <template v-if="$auth.hasPermit(['system:role:add'])">
        <el-button type="primary" :icon="Plus" @click="handleEdit('add')">添加</el-button>
      </template>
    </template>
    <el-table v-loading="isLoading" :data="itemList" border>
      <el-table-column prop="roleId" label="角色编号" width="100" align="center" />
      <el-table-column prop="roleName" label="角色名称" min-width="120" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status===0" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status===1" type="danger">已停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="170" align="center">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip />
      <el-table-column label="操作" min-width="160">
        <template #default="scope">
          <template v-if="scope.row.isSystem===1">
            <template v-if="$auth.hasPermit(['system:role:modify'])">
              <el-button type="primary" :icon="Edit" link @click="handleEdit('modify', scope.row)">修改</el-button>
            </template>
            <template v-if="$auth.hasPermit(['system:role:delete'])">
              <el-button type="danger" :icon="Delete" link @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="editVisible"
      :append-to-body="true"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :draggable="true"
      :destroy-on-close="true"
      :title="isAdd ? '添加角色' : '编辑角色'"
      width="600px"
    >
      <el-form v-loading="isEditLoading" ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model.trim="editForm.roleName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限" prop="roleMenu">
          <el-row>
            <el-col :span="24">
              <el-checkbox v-model="isTreeExpand" @change="toggleTreeExpand">展开/折叠</el-checkbox>
              <el-checkbox v-model="isTreeSelectAll" @change="toggleTreeSelectAll">全选/全不选</el-checkbox>
            </el-col>
            <el-col :span="24">
              <el-tree
                ref="treeRef"
                class="tree-border"
                node-key="menuId"
                :props="{label:'menuName',children:'children'}"
                :data="treeData"
                :default-checked-keys="editForm.roleMenu"
                :show-checkbox="true"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="remark" label="备注" style="margin-bottom:0;">
          <el-input v-model="editForm.remark" placeholder="请输入" type="textarea" :rows="3" resize="none" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :loading="isEditSubmit" @click="onSubmit()">
          {{ isAdd ? '提交' : '保存' }}{{ isEditSubmit ? '中...' : '' }}
        </el-button>
        <el-button :disabled="isEditSubmit" @click="closeDialog()">取消</el-button>
      </template>
    </el-dialog>
  </TableCard>
</template>

<script setup lang="ts" name="SystemRole">
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElTree } from 'element-plus'
import modal from '@/plugins/modal'
import { system_role_list, system_role_remove, system_role_add, system_role_modify } from '@/api/system/role'
import { system_menu_simple_list } from '@/api/system/menu'
import useList from '@/hooks/useList'

type EditType = 'add' | 'modify'
interface ListItem {
  roleId: number
  roleName: string
  status: number
  createTime: string
  remark: string
  isSystem: number
  roleMenu: string
}
interface MenuItem {
  parentId: number
  menuId: number
  menuName: string
  children?: MenuItem[]
}

const {
  isLoading,
  itemList,
  handleGetList,
  handleQuery,
} = useList<ListItem[]>({
  api: system_role_list,
  isPageable: false,
})

const editVisible = ref(false)
const editType = ref<EditType>('add')
const isAdd = computed(() => {
  return editType.value === 'add'
})

const treeData = ref<MenuItem[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()
const isTreeExpand = ref(false)
const isTreeSelectAll = ref(false)
const isEditLoading = ref(false)
const isEditSubmit = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive<{
  roleId?: number
  roleName: string
  roleMenu: number[]
  status: number
  remark: string
}>({
  roleId: undefined,
  roleName: '',
  roleMenu: [],
  status: 0,
  remark: ''
})
const editFormRules = reactive<FormRules>({
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ],
})

async function handleDelete(row: ListItem) {
  try {
    await modal.confirm(`确认删除角色为“${row.roleName}”的权限组吗？`)
    isLoading.value = true
    await system_role_remove({ roleId: row.roleId })
    modal.msgSuccess('删除成功')
    handleGetList()
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

function handleEdit(type: EditType, row?: ListItem) {
  editType.value = type
  editVisible.value = true
  isEditLoading.value = true
  system_menu_simple_list<MenuItem[]>().then(res => {
    isEditLoading.value = false
    treeData.value = res.data
    if (type === 'modify' && row) {
      nextTick(() => {
        handleEditReshow(row)
      })
    }
  }).catch(() => {
    isEditLoading.value = false
    closeDialog()
  })
}

function closeDialog() {
  if (!isEditSubmit.value) {
    handleEditReset()
    editVisible.value = false
  }
}
function handleEditReset() {
  isTreeSelectAll.value = false
  isTreeExpand.value = false
  toggleTreeExpand(false)
  treeRef.value?.setCheckedKeys([])
  editFormRef.value?.resetFields()
}
function handleEditReshow(row: ListItem) {
  const data = { ...row, roleMenu: [] as number[] }
  if (row.roleMenu) {
    let menuIds: number[] = row.roleMenu.split(',').map(item => Number(item))
    const getSelectedIds = (treeArr: MenuItem[]) => {
      treeArr.forEach(item => {
        if (item.children) {
          menuIds = menuIds.filter(i => i !== item.menuId)
          getSelectedIds(item.children)
        }
      })
    }
    getSelectedIds(treeData.value)
    data.roleMenu = menuIds
  } else {
    data.roleMenu = []
  }
  const keys = Object.keys(data)
  for (const field in editForm) {
    if (keys.includes(field)) {
      editForm[field] = data[field]
    }
  }
}

function toggleTreeExpand(checked: boolean) {
  if (treeRef.value) {
    const treeList = treeData.value
    for (let i = 0; i < treeList.length; i++) {
      treeRef.value.store.nodesMap[treeList[i].menuId].expanded = checked
    }
  }
}
function toggleTreeSelectAll(checked: boolean) {
  if (treeRef.value) {
    const nodes = checked ? treeData.value : []
    treeRef.value.setCheckedNodes(nodes as any[])
  }
}

function onSubmit() {
  if (!editFormRef.value) return
  editFormRef.value.validate(async (valid) => {
    try {
      if (!valid) return
      if (!treeRef.value) return
      const menuIds = [...treeRef.value.getHalfCheckedKeys(), ...treeRef.value.getCheckedKeys()]
      const lastParams = {
        ...editForm,
        roleMenu: menuIds.toString(),
        remark: editForm.remark.trim()
      }
      isEditSubmit.value = true
      if (isAdd.value) {
        delete lastParams.roleId
        await system_role_add(lastParams)
        modal.msgSuccess('提交成功')
      } else {
        await system_role_modify(lastParams)
        modal.msgSuccess('保存成功')
      }
      isEditSubmit.value = false
      closeDialog()
      handleGetList()
    } catch (error) {
      isEditSubmit.value = false
      console.log(error)
    }
  })
}
</script>
