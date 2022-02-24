<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <el-button icon="el-icon-refresh" @click="onQuery()">刷新</el-button>
        <template v-if="$auth.hasPermit(['blog:category:add'])">
          <el-button type="primary" icon="el-icon-plus" @click="onEdit('add')">添加</el-button>
        </template>
      </div>
      <el-table v-loading="isLoading" :data="itemList" row-key="sid" default-expand-all>
        <el-table-column prop="sortname" label="分类名称" min-width="100" />
        <el-table-column prop="alias" label="分类别名" min-width="100" />
        <el-table-column prop="taxis" label="排序" width="80" align="center">
          <template #default="scope">
            <input
              class="table-order-input"
              type="number"
              :value="scope.row.taxis"
              :disabled="!$auth.hasPermit(['blog:category:order'])"
              @focus="tempOrderNumber=scope.row.taxis"
              @blur="onOrderBlur(scope.row.sid, $event)"
            >
          </template>
        </el-table-column>
        <el-table-column prop="count" label="文章数量" min-width="80" align="center" />
        <el-table-column prop="description" label="分类描述" min-width="150" show-overflow-tooltip />
        <el-table-column label="操作" class-name="table-operate-cell" min-width="140">
          <template #default="scope">
            <template v-if="scope.row.sid !== -1">
              <el-link
                v-if="$auth.hasPermit(['blog:category:modify'])"
                type="primary"
                icon="el-icon-edit"
                @click="onEdit('modify', scope.row)"
              >修改</el-link>
              <el-popconfirm
                v-if="$auth.hasPermit(['blog:category:delete'])"
                title="确定删除吗？"
                @confirm="onRemove(scope.row)"
              >
                <template #reference>
                  <el-link type="danger" icon="el-icon-delete">删除</el-link>
                </template>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        :visible="editVisible"
        :title="isAdd ? '添加分类' : '编辑分类'"
        :append-to-body="true"
        :before-close="closeDialog"
        width="600px"
      >
        <el-form ref="formRef" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="排序" prop="taxis">
            <el-input-number v-model="editForm.taxis" :min="0" :max="99999" :step="1" />
          </el-form-item>
          <el-form-item label="父分类" prop="pid">
            <el-select v-model="editForm.pid">
              <el-option label="无" :value="0" />
              <el-option
                v-for="x in itemList"
                :key="x.sid"
                :label="x.sortname"
                :value="x.sid"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="分类名称" prop="sortname">
            <el-input v-model.trim="editForm.sortname" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="分类别名" prop="alias">
            <el-input v-model.trim="editForm.alias" placeholder="请输入..." />
          </el-form-item>
          <el-form-item label="分类描述" prop="description">
            <el-input
              v-model.trim="editForm.description"
              type="textarea"
              :rows="3"
              resize="none"
              placeholder="请输入..."
            />
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
  list_blog_category,
  remove_blog_category,
  add_blog_category,
  modify_blog_category,
  order_blog_category,
} from '@/api/blog'
import { aliasValidator } from '@/utils/validator'
export default {
  name: 'BlogCategory',
  data() {
    return {
      isLoading: false,
      itemList: [],
      tempOrderNumber: '',
      editVisible: false,
      editType: '',
      isSubmit: false,
      editForm: {
        sid: null,
        pid: 0,
        taxis: 0,
        sortname: '',
        alias: '',
        description: ''
      },
      editFormRules: {
        pid: {
          required: true,
          message: '请选择',
          trigger: 'change'
        },
        sortname: {
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        },
        alias: { validator: aliasValidator, trigger: 'blur' },
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
        const { data } = await list_blog_category()
        this.itemList = data
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    onQuery() {
      this.handleGetList()
    },
    onEdit(type, row) {
      this.editType = type
      this.editVisible = true
      if (row) {
        const keys = Object.keys(row)
        for (const field in this.editForm) {
          if (keys.includes(field)) {
            this.editForm[field] = row[field]
          }
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
    onSuccess(msg) {
      this.editVisible = false
      this.handleGetList()
      this.$modal.msgSuccess(`${msg || '操作'}成功`)
    },
    async onOrderBlur(id, e) {
      const val = ((e.target || e.srcElement).value + '').replace(/\s/g, '')
      if (!val || !/^\d{1,5}$/.test(val) || val * 1 === this.tempOrderNumber) {
        (e.target || e.srcElement).value = this.tempOrderNumber
      } else {
        await order_blog_category({
          sid: id,
          taxis: val * 1
        })
        this.onSuccess()
      }
    },
    async onRemove({ sid }) {
      try {
        this.isLoading = true
        await remove_blog_category({ sid })
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
          delete params.sid
        }
        this.isSubmit = true
        if (this.isAdd) {
          await add_blog_category(params)
        } else {
          await modify_blog_category(params)
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
