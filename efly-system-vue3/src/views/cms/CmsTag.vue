<template>
  <TableCard>
    <template #search>
      <el-form ref="queryFormRef" :model="queryParams" inline>
        <el-form-item prop="keyword">
          <el-input v-model.trim="queryParams.keyword" clearable placeholder="关键字搜索..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset()">重置</el-button>
          <template v-if="$auth.hasPermit(['cms:tag:add'])">
            <el-button type="primary" :icon="Plus" @click="handleEdit('add')">添加</el-button>
          </template>
        </el-form-item>
      </el-form>
    </template>
    <el-empty v-if="!itemCount" description="暂无标签哦，快去添加吧" />
    <div v-else class="cms-tag-list">
      <el-tag
        v-for="(item, index) in itemList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        :key="index"
        :closable="$auth.hasPermit(['cms:tag:delete'])"
        @close="handleDelete(item)"
        @click="handleEdit('modify', item)"
      >
        {{ item.tagname }}
        {{ !item.count ? '' : `(${item.count})` }}
      </el-tag>
    </div>
    <Pagination
      v-model:page="currentPage"
      v-model:limit="pageSize"
      :total="itemCount"
    />
    <el-dialog
      v-model="editVisible"
      :append-to-body="true"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :draggable="true"
      :destroy-on-close="true"
      :title="isAdd ? '添加标签' : '编辑标签'"
      width="600px"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="标签名称" prop="tagname">
          <el-input v-model.trim="editForm.tagname" placeholder="请输入..." />
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

<script setup lang="ts" name="CmsTag">
import { Search, Refresh, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import modal from '@/plugins/modal'
import auth from '@/plugins/auth'
import { cms_tag_list, cms_tag_remove, cms_tag_add, cms_tag_modify } from '@/api/cms/tag'

type EditType = 'add' | 'modify'
interface ListItem {
  tid: number
  tagname: string
  count: number | null
}

const pageSize = ref(60)
const currentPage = ref(1)
const queryFormRef = ref<FormInstance>()
const queryParams = reactive({
  keyword: '',
})
const isLoading = ref(false)
const itemList = ref<ListItem[]>([])
const itemCount = ref(0)

const editVisible = ref(false)
const editType = ref<EditType>('add')
const isAdd = computed(() => {
  return editType.value === 'add'
})

const isEditSubmit = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  tid: undefined,
  tagname: ''
})
const editFormRules = reactive<FormRules>({
  tagname: { required: true, message: '请输入标签名称', trigger: 'blur' }
})

async function handleGetList() {
  try {
    isLoading.value = true
    const { data } = await cms_tag_list<ListItem[]>(queryParams)
    itemList.value = data
    itemCount.value = data.length
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
function handleQuery() {
  currentPage.value = 1
  handleGetList()
}
function handleReset() {
  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
    handleQuery()
  }
}

async function handleDelete(row: ListItem) {
  try {
    await modal.confirm(`确认删除名为“${row.tagname}”的标签吗？`)
    isLoading.value = true
    await cms_tag_remove({ tid: row.tid })
    modal.msgSuccess('删除成功')
    handleGetList()
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

function handleEdit(type: EditType, row?: ListItem) {
  if (type === 'modify' && !auth.hasPermit(['cms:tag:modify'])) return
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
        delete params.tid
      }
      isEditSubmit.value = true
      if (isAdd.value) {
        await cms_tag_add(params)
        modal.msgSuccess('提交成功')
      } else {
        await cms_tag_modify(params)
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

handleQuery()
</script>

<style lang="scss">
.cms-tag-list {
  .el-tag {
    margin: 0 10px 10px 0;
  }
}
</style>
