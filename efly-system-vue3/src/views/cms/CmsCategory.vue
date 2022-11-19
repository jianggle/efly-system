<template>
  <MainCard>
    <template #header>
      <el-button :icon="Refresh" @click="handleQuery()">刷新</el-button>
      <template v-if="$auth.hasPermit(['cms:category:add'])">
        <el-button type="primary" :icon="Plus" @click="handleEdit('add')">添加</el-button>
      </template>
    </template>
    <el-table v-loading="isLoading" :data="itemList" row-key="sid" default-expand-all>
      <el-table-column prop="sortname" label="分类名称" min-width="100" />
      <el-table-column prop="alias" label="分类别名" min-width="100" />
      <el-table-column prop="taxis" label="排序" width="80" align="center">
        <template #default="scope">
          <input
            class="table-order-input"
            type="number"
            :value="scope.row.taxis"
            :disabled="!$auth.hasPermit(['cms:category:order'])"
            @focus="tempOrderNumber=scope.row.taxis"
            @blur="handleOrder(scope.row, $event)"
          >
        </template>
      </el-table-column>
      <el-table-column prop="count" label="文章数量" min-width="80" align="center" />
      <el-table-column prop="description" label="分类描述" min-width="150" show-overflow-tooltip />
      <el-table-column label="操作" min-width="140">
        <template #default="scope">
          <template v-if="scope.row.sid !== -1">
            <template v-if="$auth.hasPermit(['cms:category:modify'])">
              <el-button type="primary" :icon="Edit" link @click="handleEdit('modify', scope.row)">修改</el-button>
            </template>
            <template v-if="$auth.hasPermit(['cms:category:delete'])">
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
      :title="isAdd ? '添加分类' : '编辑分类'"
      width="600px"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="排序" prop="taxis">
          <el-input-number v-model="editForm.taxis" :min="0" :max="99999" :step="1" />
        </el-form-item>
        <el-form-item label="父分类" prop="pid">
          <el-select v-model="editForm.pid">
            <el-option label="无" :value="0" />
            <el-option v-for="x in itemList" :key="x.sid" :label="x.sortname" :value="x.sid" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="sortname">
          <el-input v-model.trim="editForm.sortname" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="分类别名" prop="alias">
          <el-input v-model.trim="editForm.alias" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input v-model.trim="editForm.description" type="textarea" :rows="3" resize="none" placeholder="请输入..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :loading="isEditSubmit" @click="onSubmit()">
          {{ isAdd ? '提交' : '保存' }}{{ isEditSubmit ? '中...' : '' }}
        </el-button>
        <el-button :disabled="isEditSubmit" @click="closeDialog()">取消</el-button>
      </template>
    </el-dialog>
  </MainCard>
</template>

<script setup lang="ts" name="CmsCategory">
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import modal from '@/plugins/modal'
import { aliasValidator } from '@/utils/validator'
import {
  cms_category_list,
  cms_category_remove,
  cms_category_order,
  cms_category_add,
  cms_category_modify,
} from '@/api/cms/category'
import useList from '@/hooks/useList'
import useOrder from '@/hooks/useOrder'

type EditType = 'add' | 'modify'
interface ListItem {
  pid: number
  sid: number
  sortname: string
  alias: string
  taxis: number
  description: string
}

const {
  isLoading,
  itemList,
  handleGetList,
  handleQuery,
} = useList<ListItem[]>({
  api: cms_category_list,
  isPageable: false,
})

const {
  tempOrderNumber,
  handleOrder,
} = useOrder(cms_category_order, 'sid', 'taxis', () => {
  modal.msgSuccess('操作成功')
  handleGetList()
})

const editVisible = ref(false)
const editType = ref<EditType>('add')
const isAdd = computed(() => {
  return editType.value === 'add'
})

const isEditSubmit = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  sid: undefined,
  pid: 0,
  taxis: 0,
  sortname: '',
  alias: '',
  description: ''
})
const editFormRules = reactive<FormRules>({
  pid: { required: true, message: '请选择', trigger: 'change' },
  sortname: { required: true, message: '请输入分类名称', trigger: 'blur' },
  alias: { validator: aliasValidator, trigger: 'blur' },
})

async function handleDelete(row: ListItem) {
  try {
    await modal.confirm(`确认删除名称为“${row.sortname}”的分类吗？`)
    isLoading.value = true
    await cms_category_remove({ sid: row.sid })
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
function handleEditReshow(row: ListItem) {
  const data = { ...row }
  const keys = Object.keys(data)
  for (const field in editForm) {
    if (keys.includes(field)) {
      editForm[field] = data[field]
    }
  }
}

async function onSubmit() {
  if (!editFormRef.value) return
  editFormRef.value.validate(async (valid) => {
    try {
      if (!valid) return
      const params = { ...editForm }
      if (isAdd.value) {
        delete params.sid
      }
      isEditSubmit.value = true
      if (isAdd.value) {
        await cms_category_add(params)
        modal.msgSuccess('提交成功')
      } else {
        await cms_category_modify(params)
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
