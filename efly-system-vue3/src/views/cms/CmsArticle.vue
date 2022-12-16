<template>
  <TableCard>
    <template #search>
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
          <el-button type="primary" :icon="Search" @click="handleQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="handleReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #table-header>
      <template v-if="$auth.hasPermit(['cms:article:add'])">
        <el-button type="primary" :icon="Plus" @click="handleEdit('add')">添加</el-button>
      </template>
      <template v-if="$auth.hasPermit(['cms:article:batchOperate'])">
        <el-button :disabled="isNotSelected" type="success" :icon="Open" plain @click="onOperate('publish')">发布</el-button>
        <el-button :disabled="isNotSelected" type="info" :icon="TurnOff" plain @click="onOperate('hide')">隐藏</el-button>
        <el-button :disabled="isNotSelected" type="danger" :icon="Delete" plain @click="onOperate('remove')">删除</el-button>
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
    </template>
    <el-table v-loading="isLoading" :data="itemList" border @selection-change="onSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column prop="title" label="标题" min-width="250">
        <template #default="scope">
          <el-link type="primary" :underline="false" @click="handleEdit('modify', scope.row)">
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
      <el-table-column prop="catname" label="分类" min-width="160" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.catname || '未分类' }}
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" min-width="100" show-overflow-tooltip />
      <el-table-column prop="date" label="创建时间" width="170" align="center">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="更新时间" width="170" align="center">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="views" label="阅读" width="100" align="center" />
      <el-table-column prop="comnum" label="评论" width="100" align="center" />
    </el-table>
    <Pagination
      v-model:page="pageInfo.currentPage"
      v-model:limit="pageInfo.pageSize"
      :total="itemCount"
      @change="handleGetList"
    />
    <CmsArticleEdit
      v-model="editVisible"
      :is-add="editType === 'add'"
      :reshow="editReshow"
      @ok="handleGetList"
    />
  </TableCard>
</template>

<script setup lang="ts" name="CmsArticle">
import { Search, Refresh, Plus, Edit, Delete, Open, TurnOff } from '@element-plus/icons-vue'
import modal from '@/plugins/modal'
import auth from '@/plugins/auth'
import { cms_article_list, cms_article_updateStatus, cms_article_batchOperate } from '@/api/cms/article'
import { cms_category_list } from '@/api/cms/category'
import CmsArticleEdit from './CmsArticleEdit.vue'
import useList from '@/hooks/useList'

type EditType = 'add' | 'modify'
interface ListItem {
  gid: number
  hide: string
}
interface CategoryItem {
  sid: number
  sortname: string
  children?: CategoryItem[]
}

const queryParams = reactive({
  type: 'blog',
  status: '',
  keyword: '',
  author: null,
  catid: []
})
const {
  queryFormRef,
  pageInfo,
  isLoading,
  itemList,
  itemCount,
  handleGetList,
  handleQuery,
  handleReset,
} = useList<ListItem[]>({
  api: cms_article_list,
  params: queryParams,
  formatParams: (params) => {
    const catids = params.catid
    return {
      ...params,
      catid: catids.length ? catids[catids.length - 1] : null
    }
  }
})

const {
  itemList: categoryList,
} = useList<CategoryItem[]>({
  api: cms_category_list,
  isPageable: false
})

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

function onTypeChange(type: string) {
  queryParams.type = type
  handleQuery()
}
async function onSwitchStatus({ $index, row}: { $index: number, row: ListItem }) {
  try {
    if (!auth.hasPermit(['cms:article:updateStatus'])) return
    isLoading.value = true
    const status = row.hide === 'y' ? 'n' : 'y'
    await cms_article_updateStatus({ gid: row.gid, status })
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
    await cms_article_batchOperate(params)
    modal.msgSuccess(`${operateName}成功`)
    if (operate === 'move') {
      queryParams.catid = [ ...selectedCatid.value ]
      handleQuery()
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

function handleEdit(type: EditType, row?: ListItem) {
  if (type === 'modify' && !auth.hasPermit(['cms:article:modify'])) return
  editType.value = type
  editVisible.value = true
  editReshow.value = {
    type: queryParams.type,
    gid: row && row.gid
  }
}
</script>
