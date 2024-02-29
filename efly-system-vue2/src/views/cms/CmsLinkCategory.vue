<template>
  <TableCard>
    <template #table-header>
      <el-button icon="el-icon-refresh" @click="onQuery()">刷新</el-button>
      <template v-if="$auth.hasPermit(['cms:link:addCategory'])">
        <el-button type="primary" icon="el-icon-plus" @click="onEdit('add')">添加</el-button>
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
            @focus="tempOrderNumber = scope.row.taxis"
            @blur="onOrderBlur(scope.row, $event)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="catname" label="分类名称" width="160" show-overflow-tooltip />
      <el-table-column prop="count" label="链接数量" width="100" align="center">
        <template #default="scope">
          {{ scope.row.count || 0 }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="备注" min-width="200" show-overflow-tooltip />
      <el-table-column label="操作" class-name="table-operate-cell" min-width="140">
        <template #default="scope">
          <el-link
            v-if="$auth.hasPermit(['cms:link:modifyCategory'])"
            type="primary"
            icon="el-icon-edit"
            @click="onEdit('modify', scope.row)"
          >
            修改
          </el-link>
          <el-popconfirm
            v-if="$auth.hasPermit(['cms:link:deleteCategory'])"
            title="分类下所属的链接也会被删除，确定删除吗？"
            @confirm="onRemove(scope.row)"
          >
            <template #reference>
              <el-link type="danger" icon="el-icon-delete">删除</el-link>
            </template>
          </el-popconfirm>
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
        <el-form-item label="分类名称" prop="catname">
          <el-input v-model.trim="editForm.catname" placeholder="请输入..." />
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
  </TableCard>
</template>

<script>
import {
  list_cms_link_category,
  remove_cms_link_category,
  add_cms_link_category,
  modify_cms_link_category,
  order_cms_link_category,
} from '@/api/cms'
export default {
  name: 'CmsLinkCategory',
  data() {
    return {
      isLoading: false,
      itemList: [],
      tempOrderNumber: '',
      editVisible: false,
      editType: '',
      isSubmit: false,
      editForm: {
        catid: null,
        taxis: 0,
        catname: '',
        description: '',
      },
      editFormRules: {
        catname: {
          required: true,
          message: '请输入分类名称',
          trigger: 'blur',
        },
      },
    }
  },
  computed: {
    isAdd() {
      return this.editType === 'add'
    },
  },
  created() {
    this.onQuery()
  },
  methods: {
    async handleGetList() {
      try {
        this.isLoading = true
        const { data } = await list_cms_link_category()
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
    onSuccess(msg) {
      this.editVisible = false
      this.handleGetList()
      this.$modal.msgSuccess(`${msg || '操作'}成功`)
    },
    async onOrderBlur(row, e) {
      const val = ((e.target || e.srcElement).value + '').replace(/\s/g, '')
      if (!val || !/^\d{1,5}$/.test(val) || val * 1 === this.tempOrderNumber) {
        ;(e.target || e.srcElement).value = this.tempOrderNumber
      } else {
        await order_cms_link_category({
          catid: row.catid,
          taxis: val * 1,
        })
        this.onSuccess()
      }
    },
    async onRemove({ catid }) {
      try {
        this.isLoading = true
        await remove_cms_link_category({ catid })
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
        const { description, ...params } = this.editForm
        if (this.isAdd) {
          delete params.catid
        }
        params.description = description.trim()

        this.isSubmit = true
        if (this.isAdd) {
          await add_cms_link_category(params)
        } else {
          await modify_cms_link_category(params)
        }
        this.onSuccess()
      } catch (error) {
        console.log(error)
      } finally {
        this.isSubmit = false
      }
    },
  },
}
</script>
