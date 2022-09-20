<template>
  <MainCard>
    <template #header>
      <el-form ref="queryFormRef" :model="queryParams" inline>
        <el-form-item prop="type">
          <el-radio-group v-model="queryParams.type" @change="onTypeChange">
            <el-radio-button label="blog">文章</el-radio-button>
            <el-radio-button label="page">页面</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" clearable placeholder="状态">
            <el-option value="n" label="正常" />
            <el-option value="y" label="隐藏" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="isArticle" prop="catid">
          <el-cascader
            v-model="queryParams.catid"
            :options="categoryList"
            :props="{label: 'sortname', value: 'sid'}"
            clearable
            placeholder="选择分类"
          />
        </el-form-item>
        <el-form-item prop="keyword">
          <el-input v-model.trim="queryParams.keyword" clearable placeholder="关键字搜索..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="onQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="onReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <div style="margin-bottom:10px;">
      <template v-if="$auth.hasPermit(['cms:article:add'])">
        <el-button size="small" type="primary" :icon="Plus" @click="onEdit('add')">添加</el-button>
      </template>
      <template v-if="$auth.hasPermit(['cms:article:batchOperate'])">
        <el-button :disabled="isNotSelected" size="small" type="success" :icon="Open" plain @click="onOperate('publish')">发布</el-button>
        <el-button :disabled="isNotSelected" size="small" type="info" :icon="TurnOff" plain @click="onOperate('hide')">隐藏</el-button>
        <el-button :disabled="isNotSelected" size="small" type="danger" :icon="Delete" plain @click="onOperate('remove')">删除</el-button>
        <el-cascader
          v-if="isArticle"
          v-model="selectedCatid"
          :options="categoryList"
          :props="{label: 'sortname', value: 'sid'}"
          placeholder="移动到..."
          :disabled="isNotSelected"
          style="margin-left:10px;"
          @change="onOperate('move')"
        />
      </template>
    </div>
    <el-table v-loading="isLoading" :data="itemList" border @selection-change="onSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="title" label="标题" min-width="250">
        <template #default="scope">
          <el-link type="primary" :underline="false" @click="onEdit('modify', scope.row)">
            {{ scope.row.title }}
            <img v-if="scope.row.top==='y'" src="@/assets/images/top.png" title="全局置顶">
            <img v-if="scope.row.sortop==='y'" src="@/assets/images/topcat.png" title="分类置顶">
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="hide" label="状态" width="80" align="center">
        <template #default="scope">
          <el-switch
            :model-value="scope.row.hide==='n'"
            @click.native="onSwitchStatus(scope)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="catname" label="分类" min-width="100">
        <template #default="scope">
          {{ scope.row.catname || '未分类' }}
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" min-width="100" />
      <el-table-column prop="date" label="创建时间" min-width="170">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="更新时间" min-width="170">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="views" label="阅读" min-width="80" />
      <el-table-column prop="comnum" label="评论" min-width="80" />
    </el-table>
    <Pagination
      v-model:page="queryParams.currentPage"
      v-model:limit="queryParams.pageSize"
      :total="itemCount"
      @change="handleGetList"
    />
    <CmsArticleEdit
      v-model="editVisible"
      :is-add="editType === 'add'"
      :reshow="editReshow"
      @ok="handleGetList"
    />
  </MainCard>
</template>

<script setup lang="ts" name="CmsArticle">
import { Search, Refresh, Plus, Edit, Delete, Open, TurnOff } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import modal from '@/plugins/modal'
import auth from '@/plugins/auth'
import { DEFAULT_PAGE_SIZE } from '@/config/constantValues'
import CmsArticleService from '@/api/cms/article'
import CmsCategoryService from '@/api/cms/category'
import CmsArticleEdit from './CmsArticleEdit.vue'

type EditType = 'add' | 'modify'
interface ListItem {
  gid: number
  hide: string
}

const queryFormRef = ref<FormInstance>()
const queryParams = reactive({
  pageSize: DEFAULT_PAGE_SIZE,
  currentPage: 1,
  type: 'blog',
  status: '',
  keyword: '',
  author: null,
  catid: []
})
const isLoading = ref(false)
const categoryList = ref([])
const itemList = ref<Array<ListItem>>([])
const itemCount = ref(0)
const isArticle = computed(() => {
  return queryParams.type === 'blog'
})

const selectedIds = ref<number[]>([])
const selectedCatid = ref([])
const isNotSelected = computed(() => {
  return !selectedIds.value.length
})

const editVisible = ref(false)
const editType = ref<EditType>('add')
const editReshow = ref({})

async function handleGetCategory() {
  try {
    isLoading.value = true
    const { data } = await CmsCategoryService.list({})
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
    const { catid: catids } = queryParams
    const params = {
      ...queryParams,
      catid: catids.length ? catids[catids.length - 1] : null
    }
    const { data } = await CmsArticleService.list(params)
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

function onTypeChange(type: string) {
  queryParams.type = type
  onQuery()
}
async function onSwitchStatus({ $index, row}: { $index: number, row: ListItem }) {
  try {
    if (!auth.hasPermit(['cms:article:updateStatus'])) return
    isLoading.value = true
    const status = row.hide === 'y' ? 'n' : 'y'
    await CmsArticleService.updateStatus({ gid: row.gid, status })
    itemList.value[$index].hide = status
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
function onSelectionChange(val: ListItem[]) {
  selectedIds.value = val.map(item => item.gid)
}
async function onOperate(operate: string) {
  try {
    if (isNotSelected.value) {
      return modal.alert('请先勾选要操作的文章')
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
      params.catid = selectedCatid.value[selectedCatid.value.length - 1]
    }
    await CmsArticleService.batchOperate(params)
    modal.msgSuccess(`${operateName}成功`)
    if (operate === 'move') {
      queryParams.catid = [ ...selectedCatid.value ]
      onQuery()
    } else {
      handleGetList()
    }
  } catch (error) {
    console.log(error)
  } finally {
    selectedCatid.value = []
    isLoading.value = false
  }
}

function onEdit(type: EditType, row?: ListItem) {
  if (type === 'modify' && !auth.hasPermit(['cms:article:modify'])) return
  editType.value = type
  editVisible.value = true
  editReshow.value = {
    type: queryParams.type,
    gid: row && row.gid
  }
}

handleGetCategory()
handleGetList()
</script>