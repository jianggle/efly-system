<template>
  <MainCard>
    <template #header>
      <el-form ref="queryForm" :model="queryParams" inline>
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
          <el-button type="primary" icon="el-icon-search" @click="onQuery()">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset('queryForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <div style="margin-bottom:10px;">
      <template v-if="$auth.hasPermit(['cms:article:add'])">
        <el-button type="primary" icon="el-icon-plus" @click="onEdit('add')">添加</el-button>
      </template>
      <template v-if="$auth.hasPermit(['cms:article:batchOperate'])">
        <el-button :disabled="isNotSelected" type="success" icon="el-icon-open" plain @click="onOperate('publish')">发布</el-button>
        <el-button :disabled="isNotSelected" type="info" icon="el-icon-turn-off" plain @click="onOperate('hide')">隐藏</el-button>
        <el-button :disabled="isNotSelected" type="danger" icon="el-icon-delete" plain @click="onOperate('remove')">删除</el-button>
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
            :value="scope.row.hide==='n'"
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
      <el-table-column prop="date" label="创建时间" width="160" align="center">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="date" label="更新时间" width="160" align="center">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="views" label="阅读" width="100" align="center" />
      <el-table-column prop="comnum" label="评论" width="100" align="center" />
    </el-table>
    <Pagination
      :limit.sync="queryParams.pageSize"
      :page.sync="queryParams.currentPage"
      :total="itemCount"
      @change="handleGetList"
    />
    <EditCmsArticle
      v-model="editVisible"
      :is-add="editType === 'add'"
      :reshow="editReshow"
      @ok="onSuccess"
    />
  </MainCard>
</template>

<script>
import {
  list_cms_category,
  list_cms_article,
  batch_operate_cms_article,
  update_cms_article_status
} from '@/api/cms'
import { DEFAULT_PAGE_SIZE } from '@/config/constantValues'
import EditCmsArticle from './components/EditCmsArticle'
export default {
  name: 'CmsArticle',
  components: {
    EditCmsArticle
  },
  data() {
    return {
      queryParams: {
        pageSize: DEFAULT_PAGE_SIZE,
        currentPage: 1,
        type: 'blog',
        status: '',
        keyword: '',
        author: null,
        catid: []
      },
      isLoading: false,
      categoryList: [],
      itemList: [],
      itemCount: 0,
      selectedIds: [],
      selectedCatid: [],
      editVisible: false,
      editType: '',
      editReshow: {},
    }
  },
  computed: {
    isArticle() {
      return this.queryParams.type === 'blog'
    },
    isNotSelected() {
      return !this.selectedIds.length
    }
  },
  created() {
    this.handleGetCategory()
    this.handleGetList()
  },
  methods: {
    async handleGetCategory() {
      try {
        this.isLoading = true
        const { data } = await list_cms_category()
        this.categoryList = data
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    async handleGetList() {
      try {
        this.isLoading = true
        const params = { ...this.queryParams }
        const { catid } = params
        params.catid = catid.length ? catid[catid.length - 1] : null
        const { data } = await list_cms_article(params)
        this.itemList = data.rows
        this.itemCount = data.count
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    onQuery() {
      this.queryParams.currentPage = this.$options.data().queryParams.currentPage
      this.handleGetList()
    },
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.onQuery()
    },
    onTypeChange(type) {
      Object.assign(this.queryParams, this.$options.data().queryParams, { type })
      this.handleGetList()
    },
    onEdit(type, row) {
      if (type === 'modify' && !this.$auth.hasPermit(['cms:article:modify'])) return
      this.editType = type
      this.editReshow = {
        type: this.queryParams.type,
        gid: row && row.gid
      }
      this.editVisible = true
    },
    onSuccess(msg) {
      this.editVisible = false
      this.handleGetList()
      this.$modal.msgSuccess(`${msg || '操作'}成功`)
    },
    async onSwitchStatus({ $index, row: { gid, hide }}) {
      try {
        if (!this.$auth.hasPermit(['cms:article:updateStatus'])) return
        this.isLoading = true
        const status = hide === 'y' ? 'n' : 'y'
        await update_cms_article_status({ gid, status })
        this.itemList[$index].hide = status
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    onSelectionChange(val) {
      const ids = val.map(item => item.gid)
      this.selectedIds = ids
    },
    async onOperate(operate) {
      try {
        if (this.isNotSelected) {
          return this.$modal.alert('请先勾选要操作的文章')
        }
        const ids = this.selectedIds
        const operateName = {
          publish: '发布',
          hide: '隐藏',
          remove: '删除',
          move: '改变分类',
        }[operate]
        await this.$modal.confirm(`确定将选中的${ids.length}项全部“${operateName}”吗？`)
        this.isLoading = true
        const params = { operate, ids }
        if (operate === 'move') {
          params.catid = this.selectedCatid[this.selectedCatid.length - 1]
        }
        await batch_operate_cms_article(params)
        if (operate === 'move') {
          this.queryParams.catid = [...this.selectedCatid]
          this.onQuery()
        } else {
          this.handleGetList()
        }
        this.$modal.msgSuccess(`${operateName}成功`)
      } catch (error) {
        console.log(error)
      } finally {
        this.selectedCatid = this.$options.data().selectedCatid
        this.isLoading = false
      }
    }
  }
}
</script>
