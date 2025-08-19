<template>
  <TableCard>
    <template #table-header>
      <el-button :icon="Refresh" @click="handleQuery()">刷新</el-button>
      <el-button type="primary" :icon="Plus" @click="handleEdit('add')">添加</el-button>
    </template>
    <el-table v-loading="isLoading" :data="itemList" border>
      <el-table-column prop="treeName" label="家谱名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="treeAuthorName" label="作者" min-width="160" show-overflow-tooltip />
      <el-table-column prop="updateTime" label="更新时间" min-width="180" />
      <el-table-column prop="createTime" label="创建时间" min-width="180" />
      <el-table-column label="操作" class-name="table-operate-cell" min-width="180">
        <template #default="scope">
          <el-button type="primary" :icon="Edit" link @click="handleEdit('modify', scope.row)">修改</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="handleDelete(scope.row)">
            <template #reference>
              <el-button type="danger" :icon="Delete" link>删除</el-button>
            </template>
          </el-popconfirm>
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
      :title="isAdd ? '添加家谱' : '编辑家谱'"
      width="640px"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="auto">
        <el-form-item label="家谱名称" prop="treeName">
          <el-input v-model.trim="editForm.treeName" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="家谱序" prop="treeDesc">
          <el-input v-model.trim="editForm.treeDesc" type="textarea" :rows="3" resize="none" placeholder="请输入..." />
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

<script setup lang="ts">
import { Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import modal from '@/plugins/modal'
import { list_ftree, remove_ftree, add_ftree, modify_ftree } from '@/api/ftree'
import useList from '@/hooks/useList'

defineOptions({
  name: 'FamilyTree',
})

type EditType = 'add' | 'modify'

const { isLoading, itemList, handleGetList, handleQuery } = useList<any[]>({
  api: list_ftree,
  isPageable: false,
})

const editVisible = ref(false)
const editType = ref<EditType>('add')
const isAdd = computed(() => {
  return editType.value === 'add'
})

const DEFAULT_FORM = {
  treeId: undefined,
  treeName: '',
  treeDesc: '',
}

const isEditSubmit = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = ref<Record<string, any> & typeof DEFAULT_FORM>({ ...DEFAULT_FORM })
const editFormRules = reactive<FormRules>({
  treeName: { required: true, message: '请输入家谱名称', trigger: 'blur' },
})

function handleEdit(type: EditType, row?: Record<string, any>) {
  editType.value = type
  editVisible.value = true
  if (type === 'modify' && row) {
    nextTick(() => {
      handleEditReshow(row)
    })
  }
}
function closeDialog() {
  if (!isEditSubmit.value) {
    handleEditReset()
    editVisible.value = false
  }
}
function handleEditReset() {
  editFormRef.value?.resetFields()
}
function handleEditReshow(row: Record<string, any>) {
  const data = { ...row }
  const keys = Object.keys(data)
  for (const field in editForm.value) {
    if (keys.includes(field)) {
      editForm.value[field] = data[field]
    }
  }
}

async function handleDelete({ treeId }: Record<string, any>) {
  try {
    isLoading.value = true
    await remove_ftree({ treeId })
    modal.msgSuccess('删除成功')
    handleGetList()
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

async function onSubmit() {
  if (!editFormRef.value) return
  editFormRef.value.validate(async (valid) => {
    try {
      if (!valid) return
      const params = { ...editForm.value }
      if (isAdd.value) {
        delete params.treeId
      }
      isEditSubmit.value = true
      if (isAdd.value) {
        await add_ftree(params)
        modal.msgSuccess('提交成功')
      } else {
        await modify_ftree(params)
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
