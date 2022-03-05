<template>
  <MainCard>
    <template #header>
      <el-button icon="el-icon-refresh" @click="onQuery()">刷新</el-button>
      <el-button
        v-if="$auth.hasPermit(['bill:book:add'])"
        type="primary"
        icon="el-icon-plus"
        @click="onEdit('add')"
      >添加</el-button>
    </template>
    <el-table v-loading="isLoading" :data="itemList" border>
      <el-table-column prop="bookName" label="账本名称" min-width="150">
        <template #default="scope">
          <el-link type="primary" :underline="false" @click="onOpenRecord(scope.row)">
            {{ scope.row.bookName }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="bookExpenditure" label="账本支出" min-width="100" />
      <el-table-column prop="bookIncome" label="账本收入" min-width="100" />
      <el-table-column prop="bookRemarks" label="账本备注" min-width="200" show-overflow-tooltip />
      <el-table-column label="创建时间" min-width="170">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" class-name="table-operate-cell" min-width="240">
        <template #default="scope">
          <el-link
            v-if="$auth.hasPermit(['bill:book:count'])"
            type="primary"
            icon="el-icon-data-analysis"
            @click="onCount(scope.row)"
          >计算收支</el-link>
          <el-link
            v-if="$auth.hasPermit(['bill:book:modify'])"
            type="primary"
            icon="el-icon-edit"
            @click="onEdit('modify', scope.row)"
          >修改</el-link>
          <el-link
            v-if="$auth.hasPermit(['bill:book:delete'])"
            type="danger"
            icon="el-icon-delete"
            @click="onRemove(scope.row)"
          >删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible="editVisible"
      :title="isAdd ? '添加账本' : '编辑账本'"
      :append-to-body="true"
      :before-close="closeDialog"
      width="600px"
    >
      <el-form ref="formRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item prop="bookName" label="账本名称">
          <el-input v-model.trim="editForm.bookName" placeholder="请输入..." />
        </el-form-item>
        <el-form-item prop="bookRemarks" label="账本备注" style="margin-bottom:0;">
          <el-input v-model="editForm.bookRemarks" placeholder="请输入..." type="textarea" :rows="3" resize="none" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :loading="isSubmit" @click="onSubmit()">
          {{ isAdd ? '提交' : '保存' }}{{ isSubmit ? '中...' : '' }}
        </el-button>
        <el-button :disabled="isSubmit" @click="closeDialog()">取消</el-button>
      </template>
    </el-dialog>
    <el-dialog :visible.sync="viewVisible" top="50px" width="70%" append-to-body close-on-click-modal>
      <div slot="title">
        <el-page-header :content="activeBookInfo.bookName" @back="viewVisible=false" />
      </div>
      <BillRecord v-if="viewVisible" :book-id="activeBookInfo.bookId" />
    </el-dialog>
  </MainCard>
</template>

<script>
import {
  list_bill_book,
  modify_bill_book,
  add_bill_book,
  remove_bill_book,
  count_bill_book
} from '@/api/bill'
import BillRecord from './BillRecord'
export default {
  name: 'BillBook',
  components: {
    BillRecord
  },
  data() {
    return {
      isLoading: false,
      itemList: [],
      editVisible: false,
      editType: '',
      isSubmit: false,
      editForm: {
        bookId: null,
        bookName: '',
        bookRemarks: ''
      },
      editFormRules: {
        bookName: {
          required: true,
          message: '请输入账本名称',
          trigger: 'blur'
        }
      },
      viewVisible: false,
      activeBookInfo: {},
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
        const { data } = await list_bill_book()
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
    onOpenRecord({ bookId, bookName }) {
      this.activeBookInfo = { bookId, bookName }
      this.viewVisible = true
    },
    onSuccess(msg) {
      this.editVisible = false
      this.handleGetList()
      this.$modal.msgSuccess(`${msg || '操作'}成功`)
    },
    async onRemove({ bookId, bookName }) {
      try {
        await this.$modal.confirm(`确定删除名为“${bookName}”的帐本吗？`)
        this.isLoading = true
        await remove_bill_book({ bookId })
        this.onSuccess('删除')
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    async onCount({ bookId }) {
      try {
        this.isLoading = true
        await count_bill_book({ bookId })
        this.onSuccess('计算')
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
          delete params.bookId
        }
        this.isSubmit = true
        if (this.isAdd) {
          await add_bill_book(params)
        } else {
          await modify_bill_book(params)
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
