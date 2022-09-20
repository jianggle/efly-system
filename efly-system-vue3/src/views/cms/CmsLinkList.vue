<template>
  <MainCard>
    <template #header>
      <el-form ref="queryFormRef" :model="queryParams" inline>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" clearable placeholder="状态">
            <el-option value="n" label="正常" />
            <el-option value="y" label="隐藏" />
          </el-select>
        </el-form-item>
        <el-form-item prop="catid">
          <el-select v-model="queryParams.catid" clearable placeholder="链接分类">
            <el-option v-for="item in categoryList" :key="item.catid" :label="item.catname" :value="item.catid" />
          </el-select>
        </el-form-item>
        <el-form-item prop="keyword">
          <el-input v-model.trim="queryParams.keyword" clearable placeholder="链接名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="onQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <div style="margin-bottom:10px;">
      <template v-if="$auth.hasPermit(['cms:link:add'])">
        <el-button size="small" type="primary" :icon="Plus" @click="onEdit('add')">添加</el-button>
      </template>
      <template v-if="$auth.hasPermit(['cms:link:batchOperate'])">
        <el-button :disabled="isNotSelected" size="small" type="success" :icon="Open" plain @click="onOperate('publish')">发布</el-button>
        <el-button :disabled="isNotSelected" size="small" type="info" :icon="TurnOff" plain @click="onOperate('hide')">隐藏</el-button>
        <el-button :disabled="isNotSelected" size="small" type="danger" :icon="Delete" plain @click="onOperate('remove')">删除</el-button>
        <el-select v-model="selectedCatid" :disabled="isNotSelected" placeholder="移动到..." @change="onOperate('move')" style="margin-left:10px;">
          <el-option v-for="item in categoryList" :key="item.catid" :label="item.catname" :value="item.catid" />
        </el-select>
      </template>
    </div>
    <el-table v-loading="isLoading" :data="itemList" border @selection-change="onSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="taxis" label="排序" width="80" align="center">
        <template #default="scope">
          <input
            class="table-order-input"
            type="number"
            :value="scope.row.taxis"
            :disabled="!$auth.hasPermit(['cms:link:order'])"
            @focus="tempOrderNumber=scope.row.taxis"
            @blur="onOrderBlur(scope.row, $event)"
          >
        </template>
      </el-table-column>
      <el-table-column prop="sitename" label="链接名称" width="200">
        <template #default="scope">
          <el-link type="primary" :href="scope.row.siteurl" target="_blank" rel="noreferrer noopener">
            {{ scope.row.sitename }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="siteurl" label="链接" show-overflow-tooltip />
      <el-table-column prop="catname" label="链接分类" width="120" />
      <el-table-column prop="hide" label="状态" width="80" align="center">
        <template #default="scope">
          <el-switch
            :model-value="scope.row.hide==='n'"
            @click.native="onSwitchStatus(scope)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column label="操作" min-width="140">
        <template #default="scope">
          <template v-if="$auth.hasPermit(['cms:link:modify'])">
            <el-button type="primary" :icon="Edit" link @click="onEdit('modify', scope.row)">修改</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="queryParams.currentPage"
      v-model:limit="queryParams.pageSize"
      :total="itemCount"
      @change="handleGetList"
    />
    <el-dialog
      v-model="editVisible"
      :append-to-body="true"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :draggable="true"
      :destroy-on-close="true"
      :title="isAdd ? '添加链接' : '编辑链接'"
      width="600px"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="排序" prop="taxis">
          <el-input-number v-model="editForm.taxis" :min="0" :max="99999" :step="1" />
        </el-form-item>
        <el-form-item label="链接名称" prop="sitename">
          <el-input v-model.trim="editForm.sitename" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="链接地址" prop="siteurl">
          <el-input v-model.trim="editForm.siteurl" type="textarea" resize="none" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="链接分类" prop="catid">
          <el-select v-model="editForm.catid">
            <el-option v-for="item in categoryList" :key="item.catid" :label="item.catname" :value="item.catid" />
          </el-select>
        </el-form-item>
        <el-form-item label="链接描述" prop="description">
          <el-input v-model.trim="editForm.description" type="textarea" :rows="3" resize="none" placeholder="请输入..." />
        </el-form-item>
        <el-form-item label="状态" prop="hide">
          <el-radio-group v-model="editForm.hide">
            <el-radio label="n">正常</el-radio>
            <el-radio label="y">隐藏</el-radio>
          </el-radio-group>
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

<script setup lang="ts" name="CmsLinkList">
import { Search, Refresh, Plus, Edit, Delete, Open, TurnOff } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import modal from '@/plugins/modal'
import auth from '@/plugins/auth'
import { DEFAULT_PAGE_SIZE } from '@/config/constantValues'
import CmsLinkService from '@/api/cms/link'

type EditType = 'add' | 'modify'
type HideStatus = 'y' | 'n'
interface CategoryItem {
  catid: number
  catname: string
}
interface ListItem {
  catid: number
  catname: string
  id: number
  sitename: string
  siteurl: string
  taxis: number
  description: string
  hide: HideStatus
}

const queryFormRef = ref<FormInstance>()
const queryParams = reactive<{
  pageSize: number
  currentPage: number
  status: string
  catid: number | null
  keyword: string
}>({
  pageSize: DEFAULT_PAGE_SIZE,
  currentPage: 1,
  status: '',
  catid: null,
  keyword: '',
})
const isLoading = ref(false)
const itemList = ref<Array<ListItem>>([])
const itemCount = ref(0)

const categoryList = ref<Array<CategoryItem>>([])
const tempOrderNumber = ref(0)
const selectedIds = ref<number[]>([])
const selectedCatid = ref<number | null>(null)
const isNotSelected = computed(() => {
  return !selectedIds.value.length
})

const editVisible = ref(false)
const editType = ref<EditType>('add')
const isAdd = computed(() => {
  return editType.value === 'add'
})

const isEditSubmit = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  id: undefined,
  taxis: 0,
  sitename: '',
  siteurl: '',
  catid: null,
  description: '',
  hide: 'n',
})
const editFormRules = reactive<FormRules>({
  sitename: { required: true, message: '请输入链接名称', trigger: 'blur' },
  siteurl: { required: true, message: '请输入链接地址', trigger: 'blur' },
  catid: { required: true, message: '请选择链接分类', trigger: 'change' }
})

async function handleGetCategory() {
  try {
    isLoading.value = true
    const { data } = await CmsLinkService.listCategory({})
    categoryList.value = data
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
async function handleGetList() {
  try {
    isLoading.value = true
    const { data } = await CmsLinkService.listLink(queryParams)
    itemList.value = data.rows
    itemCount.value = data.count
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
function onQuery() {
  queryParams.currentPage = 1
  handleGetList()
}
function onReset() {
  if (!queryFormRef.value) return
  queryFormRef.value.resetFields()
  onQuery()
}

async function onOrderBlur(row: ListItem, e: any) {
  const val = ((e.target || e.srcElement).value + '').replace(/\s/g, '')
  if (!val || !/^\d{1,5}$/.test(val) || parseInt(val) === tempOrderNumber.value) {
    (e.target || e.srcElement).value = tempOrderNumber.value
  } else {
    await CmsLinkService.orderLink({
      id: row.id,
      taxis: parseInt(val)
    })
    modal.msgSuccess('操作成功')
    handleGetList()
  }
}
async function onSwitchStatus({ $index, row }: { $index: number, row: ListItem }) {
  try {
    if (!auth.hasPermit(['cms:link:updateStatus'])) return
    isLoading.value = true
    const status = row.hide === 'y' ? 'n' : 'y'
    await CmsLinkService.updateLinkStatus({ id: row.id, status })
    itemList.value[$index].hide = status
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

function onSelectionChange(val: ListItem[]) {
  selectedIds.value = val.map(item => item.id)
}
async function onOperate(operate: string) {
  try {
    if (isNotSelected.value) {
      return modal.alert('请先勾选要操作的链接')
    }
    const ids = [ ...selectedIds.value ]
    const operateName = { publish: '发布', hide: '隐藏', remove: '删除', move: '改变分类' }[operate]
    await modal.confirm(`确定将选中的${ids.length}项全部“${operateName}”吗？`)
    isLoading.value = true
    interface OperateParams {
      catid?: number | null
      operate: string
      ids: number[]
    }
    const params: OperateParams = { operate, ids }
    if (operate === 'move') {
      params.catid = selectedCatid.value
    }
    await CmsLinkService.batchOperateLink(params)
    modal.msgSuccess(`${operateName}成功`)
    if (operate === 'move') {
      queryParams.catid = selectedCatid.value
      onQuery()
    } else {
      handleGetList()
    }
  } catch (error) {
    console.log(error)
  } finally {
    selectedCatid.value = null
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
        delete params.id
      }
      isEditSubmit.value = true
      if (isAdd.value) {
        await CmsLinkService.addLink(params)
        modal.msgSuccess('提交成功')
      } else {
        await CmsLinkService.modifyLink(params)
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

handleGetCategory()
onQuery()
</script>