<template>
  <TableCard>
    <template #search>
      <el-form ref="queryForm" :model="queryParams" inline>
        <el-form-item prop="keyword">
          <el-input v-model.trim="queryParams.keyword" clearable placeholder="关键字搜索..." />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onQuery()">查询</el-button>
          <el-button icon="el-icon-refresh" @click="onReset('queryForm')">重置</el-button>
          <template v-if="$auth.hasPermit(['cms:tag:add'])">
            <el-button type="primary" icon="el-icon-plus" @click="onEdit('add')">添加</el-button>
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
        @close="onRemove(item)"
        @click="onEdit('modify', item)"
      >
        {{ item.tagname }}
        {{ !item.count ? '' : `(${item.count})` }}
      </el-tag>
    </div>
    <el-dialog
      :visible="editVisible"
      :title="isAdd ? '添加标签' : '编辑标签'"
      :append-to-body="true"
      :before-close="closeDialog"
      width="600px"
    >
      <el-form ref="formRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="标签名称" prop="tagname">
          <el-input v-model.trim="editForm.tagname" placeholder="请输入..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :loading="isSubmit" @click="onSubmit()">
          {{ isAdd ? '提交' : '保存' }}{{ isSubmit ? '中...' : '' }}
        </el-button>
        <el-button :disabled="isSubmit" @click="closeDialog()">取消</el-button>
      </template>
    </el-dialog>
    <Pagination
      :limit.sync="pageSize"
      :page.sync="currentPage"
      :total="itemCount"
    />
  </TableCard>
</template>

<script>
import { list_cms_tag, remove_cms_tag, add_cms_tag, modify_cms_tag } from '@/api/cms'
export default {
  name: 'CmsTag',
  data() {
    return {
      pageSize: 60,
      currentPage: 1,
      queryParams: {
        keyword: '',
      },
      isLoading: false,
      itemList: [],
      itemCount: 0,
      editVisible: false,
      editType: '',
      isSubmit: false,
      editForm: {
        tid: null,
        tagname: ''
      },
      editFormRules: {
        tagname: {
          required: true,
          message: '请输入标签名称',
          trigger: 'blur'
        }
      }
    }
  },
  computed: {
    isAdd() {
      return this.editType === 'add'
    }
  },
  created() {
    this.onQuery()
  },
  methods: {
    async handleGetList() {
      try {
        this.isLoading = true
        const { data } = await list_cms_tag(this.queryParams)
        this.itemList = data
        this.itemCount = data.length
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    onQuery() {
      this.currentPage = this.$options.data().currentPage
      this.handleGetList()
    },
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.onQuery()
    },
    onEdit(type, row) {
      if (type === 'modify' && !this.$auth.hasPermit(['cms:tag:modify'])) return
      this.editType = type
      this.editVisible = true
      Object.assign(this.editForm, {
        tid: row ? row.tid : null,
        tagname: row ? row.tagname : ''
      })
    },
    closeDialog() {
      if (!this.isSubmit) {
        this.$refs.formRef.resetFields()
        this.editVisible = false
      }
    },
    onSuccess(msg) {
      this.editVisible = false
      this.handleGetList()
      this.$modal.msgSuccess(`${msg || '操作'}成功`)
    },
    async onRemove({ tid, tagname }) {
      try {
        await this.$modal.confirm(`确认要删除名为“${tagname}”的标签吗？`)
        this.isLoading = true
        await remove_cms_tag({ tid })
        this.onSuccess('删除')
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    async onSubmit() {
      try {
        await this.$refs.formRef.validate()
        const params = { ...this.editForm }
        if (this.isAdd) {
          delete params.tid
        }
        this.isSubmit = true
        if (this.isAdd) {
          await add_cms_tag(params)
        } else {
          await modify_cms_tag(params)
        }
        this.onSuccess()
      } catch (error) {
        console.log(error)
      } finally {
        this.isSubmit = false
      }
    }
  }
}
</script>

<style lang="scss">
.cms-tag-list {
  .el-tag {
    margin: 0 10px 10px 0;
  }
}
</style>
