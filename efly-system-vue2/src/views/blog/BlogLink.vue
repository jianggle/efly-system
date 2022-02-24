<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <el-form ref="queryForm" :model="queryParams" inline>
          <el-form-item prop="status">
            <el-select v-model="queryParams.status" clearable placeholder="状态">
              <el-option value="n" label="正常" />
              <el-option value="y" label="隐藏" />
            </el-select>
          </el-form-item>
          <el-form-item prop="catid">
            <el-select v-model="queryParams.catid" clearable placeholder="链接分类">
              <el-option
                v-for="item in categoryList"
                :key="item.catid"
                :label="item.catname"
                :value="item.catid"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="keyword">
            <el-input v-model.trim="queryParams.keyword" clearable placeholder="链接名称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery()">查询</el-button>
            <el-button icon="el-icon-refresh" @click="onReset('queryForm')">重置</el-button>
            <template v-if="$auth.hasPermit(['blog:link:add'])">
              <el-button type="primary" icon="el-icon-plus" @click="onEdit('add')">添加</el-button>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-loading="isLoading" :data="itemList" border>
        <el-table-column prop="taxis" label="排序" width="80" align="center" />
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
              :value="scope.row.hide==='n'"
              @click.native="onSwitchStatus(scope)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="操作" class-name="table-operate-cell" min-width="140">
          <template #default="scope">
            <el-link
              v-if="$auth.hasPermit(['blog:link:modify'])"
              type="primary"
              icon="el-icon-edit"
              @click="onEdit('modify', scope.row)"
            >修改</el-link>
            <el-popconfirm
              v-if="$auth.hasPermit(['blog:link:delete'])"
              title="确定删除吗？"
              @confirm="onRemove(scope.row)"
            >
              <template #reference>
                <el-link type="danger" icon="el-icon-delete">删除</el-link>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :limit.sync="queryParams.pageSize"
        :page.sync="queryParams.currentPage"
        :total="itemCount"
        @change="handleGetList"
      />
      <el-dialog
        :visible="editVisible"
        :title="isAdd ? '添加链接' : '编辑链接'"
        :append-to-body="true"
        :before-close="closeDialog"
        width="600px"
      >
        <el-form ref="formRef" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="排序" prop="taxis">
            <el-input-number v-model="editForm.taxis" :min="0" :max="99999" :step="1" />
          </el-form-item>
          <el-form-item label="链接名称" prop="sitename">
            <el-input v-model.trim="editForm.sitename" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="链接地址" prop="siteurl">
            <el-input
              v-model.trim="editForm.siteurl"
              type="textarea"
              resize="none"
              placeholder="请输入..."
            />
          </el-form-item>
          <el-form-item label="链接分类" prop="catid">
            <el-select v-model="editForm.catid">
              <el-option
                v-for="item in categoryList"
                :key="item.catid"
                :label="item.catname"
                :value="item.catid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="链接描述" prop="description">
            <el-input
              v-model="editForm.description"
              type="textarea"
              :rows="3"
              resize="none"
              placeholder="请输入..."
            />
          </el-form-item>
          <el-form-item label="状态" prop="hide">
            <el-radio-group v-model="editForm.hide">
              <el-radio label="n">正常</el-radio>
              <el-radio label="y">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="primary" :loading="isSubmit" @click="onSubmit()">
            {{ isAdd ? '提交' : '保存' }}{{ isSubmit ? '中...' : '' }}
          </el-button>
          <el-button :disabled="isSubmit" @click="closeDialog()">取消</el-button>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  list_blog_link_category,
  list_blog_link,
  remove_blog_link,
  add_blog_link,
  modify_blog_link,
  update_blog_link_status
} from '@/api/blog'
import { DEFAULT_PAGE_SIZE } from '@/config/constantValues'
export default {
  name: 'BlogLink',
  data() {
    return {
      queryParams: {
        pageSize: DEFAULT_PAGE_SIZE,
        currentPage: 1,
        status: '',
        catid: null,
        keyword: '',
      },
      isLoading: false,
      itemList: [],
      itemCount: 0,
      categoryList: [],
      editVisible: false,
      editType: '',
      isSubmit: false,
      editForm: {
        id: null,
        taxis: 0,
        sitename: '',
        siteurl: '',
        catid: null,
        description: '',
        hide: 'n',
      },
      editFormRules: {
        sitename: {
          required: true,
          message: '请输入链接名称',
          trigger: 'blur'
        },
        siteurl: {
          required: true,
          message: '请输入链接地址',
          trigger: 'blur'
        },
        catid: {
          required: true,
          message: '请选择链接分类',
          trigger: 'change'
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
    this.handleGetCategory()
    this.onQuery()
  },
  methods: {
    async handleGetCategory() {
      try {
        this.isLoading = true
        const { data } = await list_blog_link_category()
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
        const { data } = await list_blog_link(this.queryParams)
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
    onSuccess(msg) {
      this.editVisible = false
      this.handleGetList()
      this.$modal.msgSuccess(`${msg || '操作'}成功`)
    },
    async onSwitchStatus({ $index, row: { id, hide }}) {
      try {
        if (!this.$auth.hasPermit(['blog:link:updateStatus'])) return
        this.isLoading = true
        const status = hide === 'y' ? 'n' : 'y'
        await update_blog_link_status({ id, status })
        this.itemList[$index].hide = status
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    async onRemove({ id }) {
      try {
        this.isLoading = true
        await remove_blog_link({ id })
        this.onSuccess('删除')
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    onEdit(type, row) {
      this.editType = type
      this.editVisible = true
      if (row) {
        const keys = Object.keys(row)
        for (const field in this.editForm) {
          if (!keys.includes(field)) continue
          this.editForm[field] = row[field]
        }
      } else {
        Object.assign(this.editForm, this.$options.data().editForm)
      }
    },
    closeDialog() {
      if (!this.isSubmit) {
        this.$refs.formRef.resetFields()
        this.editVisible = false
      }
    },
    async onSubmit() {
      try {
        await this.$refs.formRef.validate()
        const params = { ...this.editForm }
        if (this.isAdd) {
          delete params.id
        }
        params.description = params.description.trim()

        this.isSubmit = true
        if (this.isAdd) {
          await add_blog_link(params)
        } else {
          await modify_blog_link(params)
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
