<template>
  <MainCard>
    <template #header>
      <el-button :icon="Refresh" @click="onQuery()">刷新</el-button>
      <template v-if="$auth.hasPermit(['cms:link:addCategory'])">
        <el-button type="primary" :icon="Plus" @click="onEdit('add')">添加</el-button>
      </template>
    </template>
    <el-table v-loading="isLoading" :data="itemList" border>
      <el-table-column prop="taxis" label="排序" width="80" align="center">
        <template #default="scope">
          <input
            class="table-order-input"
            type="number"
            :value="scope.row.taxis"
            :disabled="!$auth.hasPermit(['cms:link:orderCategory'])"
            @focus="tempOrderNumber=scope.row.taxis"
            @blur="onOrderBlur(scope.row, $event)"
          >
        </template>
      </el-table-column>
      <el-table-column prop="catname" label="分类名称" min-width="100" />
      <el-table-column prop="count" label="链接数量" width="100" align="center">
        <template #default="scope">
          {{ scope.row.count || 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="备注" show-overflow-tooltip />
      <el-table-column label="操作" min-width="140">
        <template #default="scope">
          <template v-if="$auth.hasPermit(['cms:link:modifyCategory'])">
            <el-button type="primary" :icon="Edit" link @click="onEdit('modify', scope.row)">修改</el-button>
          </template>
          <template v-if="$auth.hasPermit(['cms:link:deleteCategory'])">
            <el-button type="danger" :icon="Delete" link @click="onRemove(scope.row)">删除</el-button>
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
        <el-form-item label="分类名称" prop="catname">
          <el-input v-model.trim="editForm.catname" placeholder="请输入..." />
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

<script setup lang="ts" name="CmsLinkCategory">
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import modal from '@/plugins/modal'
import CmsLinkService from '@/api/cms/link'

type EditType = 'add' | 'modify'
interface ListItem {
  catid: number
  catname: string
  taxis: number
  description: string
  count: number | null
}

const isLoading = ref(false)
const itemList = ref<Array<ListItem>>([])
const tempOrderNumber = ref(0)

const editVisible = ref(false)
const editType = ref<EditType>('add')
const isAdd = computed(() => {
  return editType.value === 'add'
})

const isEditSubmit = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  catid: undefined,
  taxis: 0,
  catname: '',
  description: ''
})
const editFormRules = reactive({
  catname: { required: true, message: '请输入分类名称', trigger: 'blur' }
})

async function handleGetList() {
  try {
    isLoading.value = true
    const { data } = await CmsLinkService.listCategory({})
    itemList.value = data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
function onQuery() {
  handleGetList()
}

async function onOrderBlur(row: ListItem, e: any) {
  const val = ((e.target || e.srcElement).value + '').replace(/\s/g, '')
  if (!val || !/^\d{1,5}$/.test(val) || parseInt(val) === tempOrderNumber.value) {
    (e.target || e.srcElement).value = tempOrderNumber.value
  } else {
    await CmsLinkService.orderCategory({
      catid: row.catid,
      taxis: parseInt(val)
    })
    modal.msgSuccess('操作成功')
    handleGetList()
  }
}
async function onRemove(row: ListItem) {
  try {
    await modal.confirm(`分类下所属的链接也会被删除，确定删除吗？`)
    isLoading.value = true
    await CmsLinkService.removeCategory({ catid: row.catid })
    modal.msgSuccess('删除成功')
    handleGetList()
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

function onEdit(type: EditType, row?: ListItem) {
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
        delete params.catid
      }
      isEditSubmit.value = true
      if (isAdd.value) {
        await CmsLinkService.addCategory(params)
        modal.msgSuccess('提交成功')
      } else {
        await CmsLinkService.modifyCategory(params)
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

onQuery()
</script>