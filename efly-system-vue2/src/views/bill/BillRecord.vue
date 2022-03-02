<template>
  <div class="app-container" :style="bookId ? 'padding:0;' : ''">
    <el-card>
      <div slot="header">
        <el-form ref="queryForm" :model="queryParams" inline>
          <el-form-item prop="tradePlatform">
            <el-select v-model="queryParams.tradePlatform" clearable placeholder="交易平台">
              <el-option
                v-for="(val, key) in platformOptions"
                :key="key"
                :label="val"
                :value="key"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="tradeShouzhi">
            <el-select v-model="queryParams.tradeShouzhi" clearable placeholder="收/支">
              <el-option label="支出" value="支出" />
              <el-option label="收入" value="收入" />
            </el-select>
          </el-form-item>
          <el-form-item prop="tradePos">
            <el-input v-model.trim="queryParams.tradePos" clearable placeholder="交易对方" />
          </el-form-item>
          <el-form-item prop="timeRange">
            <el-date-picker
              v-model="queryParams.timeRange"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              :default-time="['00:00:00','23:59:59']"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onQuery()">查询</el-button>
            <el-button icon="el-icon-refresh" @click="onReset()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-form inline>
        <template v-if="bookId">
          <el-form-item v-if="$auth.hasPermit(['bill:book:deleteRecord'])">
            <el-button type="danger" icon="el-icon-delete" plain @click="onRemoveFromBook()">从该帐本中移除</el-button>
          </el-form-item>
        </template>
        <template v-else>
          <template v-if="$auth.hasPermit(['bill:record:toBook'])">
            <el-form-item>
              <el-select v-model="activeBillBook" clearable placeholder="请选择账本">
                <el-option
                  v-for="x in billBooks"
                  :key="x.bookId"
                  :label="x.bookName"
                  :value="x.bookId"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-folder" @click="onRecordToBook()">批量入账</el-button>
            </el-form-item>
          </template>
          <template v-if="$auth.hasPermit(['bill:record:import'])">
            <el-form-item>
              <el-select v-model="importOrigin" clearable placeholder="请选择文件来源">
                <el-option
                  v-for="(val, key) in platformOptions"
                  :key="key"
                  :label="val"
                  :value="key"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-upload2" @click="onImport()">导入</el-button>
            </el-form-item>
          </template>
        </template>
      </el-form>
      <input ref="myfile" type="file" accept="*" style="display:none" @change="onFileImport">
      <el-table
        ref="tableEl"
        v-loading="isLoading"
        :data="itemList"
        :border="true"
        @selection-change="handleSelectionChange"
        @cell-dblclick="onCellDBclick"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column prop="tradePlatform" label="平台" width="70" />
        <el-table-column prop="tradeTimeCreate" label="创建时间" width="170" />
        <el-table-column prop="tradeMoney" label="收/支" width="120">
          <template #default="scope">
            <span :style="scope.row.tradeShouzhi==='收入' ? 'color:#f00' : ''">
              {{ {'收入':'+', '支出':'-'}[scope.row.tradeShouzhi] || scope.row.tradeShouzhi }}
              {{ scope.row.tradeMoney }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="tradeGoods" label="商品名称" show-overflow-tooltip />
        <el-table-column prop="tradePos" label="交易对方" show-overflow-tooltip />
        <el-table-column prop="tradeStatus" label="交易状态" show-overflow-tooltip />
        <el-table-column prop="tradeType" label="交易类型" show-overflow-tooltip />
      </el-table>
      <Pagination
        :limit.sync="queryParams.pageSize"
        :page.sync="queryParams.currentPage"
        :total="itemCount"
        @change="handleGetList"
      />
      <el-dialog :visible.sync="visibleDetail" append-to-body close-on-click-modal>
        <div slot="title">
          <el-page-header content="详情信息" @back="visibleDetail=false" />
        </div>
        <el-descriptions :border="true" :column="2">
          <el-descriptions-item v-for="(item, index) in detailCellFields" :key="index" :label="item.name">
            {{ activeRowData[item.code] }}
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  list_bill_book,
  list_bill_record,
  import_bill_record,
  batch_record_to_book,
  remove_bill_book_record
} from '@/api/bill'
import { DEFAULT_PAGE_SIZE } from '@/config/constantValues'
export default {
  name: 'BillRecord',
  props: {
    bookId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      queryParams: {
        pageSize: DEFAULT_PAGE_SIZE,
        currentPage: 1,
        bookId: this.bookId,
        tradePlatform: '',
        tradeShouzhi: '',
        tradePos: '',
        timeRange: [],
      },
      isLoading: false,
      itemList: [],
      itemCount: 0,
      platformOptions: {
        alipay: '支付宝',
        wechat: '微信'
      },
      importOrigin: '',
      billBooks: [],
      selectedItems: [],
      activeBillBook: null,
      visibleDetail: false,
      activeRowData: {},
      detailCellFields: [
        { code: 'tradePlatform', name: '平台' },
        { code: 'tradeNoPlatform', name: '交易单号' },
        { code: 'tradeShouzhi', name: '收/支' },
        { code: 'tradeMoney', name: '金额' },
        { code: 'tradeTimeCreate', name: '创建时间' },
        { code: 'tradeTimePay', name: '付款时间' },
        { code: 'tradeTimeUpdate', name: '修改时间' },
        { code: 'tradeGoods', name: '商品名称' },
        { code: 'tradeNoPos', name: '商户单号' },
        { code: 'tradePos', name: '交易对方' },
        { code: 'tradeStatus', name: '交易状态' },
        { code: 'tradeType', name: '交易类型' },
        { code: 'tradePayType', name: '支付方式' },
        { code: 'tradeFee', name: '服务费' },
        { code: 'tradeRefund', name: '退款' },
        { code: 'tradeMoneyStatus', name: '资金状态' },
        { code: 'tradeOrigin', name: '交易来源' },
        { code: 'tradeRemarks', name: '备注' },
      ]
    }
  },
  created() {
    this.getBillBook()
    this.onQuery()
  },
  methods: {
    async getBillBook() {
      try {
        const { data } = await list_bill_book()
        this.billBooks = data
      } catch (error) {
        console.log(error)
      }
    },
    async handleGetList() {
      try {
        this.isLoading = true
        const params = { ...this.queryParams }
        params.timeRange = Array.isArray(params.timeRange) ? params.timeRange.join(',') : ''
        const { data } = await list_bill_record(params)
        data.rows.forEach(item => {
          item.tradePlatform = this.platformOptions[item.tradePlatform] || item.tradePlatform
          item.tradeTimeCreate = this.$utils.formatDate(item.tradeTimeCreate)
          item.tradeTimePay = this.$utils.formatDate(item.tradeTimePay)
          item.tradeTimeUpdate = this.$utils.formatDate(item.tradeTimeUpdate)
        })
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
    onReset() {
      this.$refs.queryForm.resetFields()
      this.onQuery()
    },
    onCellDBclick(row) {
      this.activeRowData = row
      this.visibleDetail = true
    },
    onImport() {
      if (!this.importOrigin) {
        this.$message.warning('请选择账单文件来源')
      } else {
        this.$refs['myfile'].click()
      }
    },
    async onFileImport(event) {
      try {
        this.isLoading = true
        const files = (event.srcElement || event.target).files
        const [file] = files
        if (!files) return
        if (!/\.csv$/.test(file.name.toLowerCase())) {
          return this.$alert('仅支持csv文件', '温馨提示')
        }
        const formData = new FormData()
        formData.append('importOrigin', this.importOrigin)
        formData.append('file', file)
        const { data } = await import_bill_record(formData)
        this.$alert(data, '温馨提示').then(() => {
          this.onReset()
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.$refs['myfile'].value = ''
        this.isLoading = false
      }
    },
    handleSelectionChange(val) {
      this.selectedItems = val
    },
    async onRecordToBook() {
      try {
        if (!this.activeBillBook) {
          return this.$message.warning('请选择账本')
        }
        if (!this.selectedItems.length) {
          return this.$message.warning('请选择要录入的账单')
        }
        this.isLoading = true
        const { data } = await batch_record_to_book({
          bookId: this.activeBillBook,
          ids: this.selectedItems.map(item => item.recordId).join(',')
        })
        this.$refs.tableEl.clearSelection()
        this.$alert(data, '温馨提示')
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    async onRemoveFromBook() {
      try {
        if (!this.selectedItems.length) {
          return this.$message.warning('请选择要移除的账目')
        }
        this.isLoading = true
        await remove_bill_book_record({
          bookId: this.bookId,
          ids: this.selectedItems.map(item => item.recordId).join(',')
        })
        this.$message.success('移除成功')
        this.$refs.tableEl.clearSelection()
        this.onReset()
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
