<template>
  <div v-if="staticbaseknown" v-loading="wholePageLoading" class="snapshot-summary-page">
    <!-- <el-dialog
      title="序列号过期或不合法"
      :visible.sync="blockingLicenseWindow"
      width="50%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      model="true"
    >
      <el-input v-model="licenseCode" type="textarea" :row="2" placeholder="请输入序列号" />
      <template #footer>
        <el-button type="success" @click="getOnlineLicense()">获取序列号</el-button>
        <el-button type="primary" @click="updateLicense()">更新</el-button>
      </template>
    </el-dialog> -->
    <div class="snapshot-summary-content">
      <div class="center-content">
        <div class="place-taker"></div>
        <div v-if="mysnapshots.length < 1" id="snap-empty-placeholder"></div>
        <div v-if="mysnapshots.length > 0" id="snap-title"></div>
        <div class="snapshot-item-holder">
          <ul>
            <li v-for="item in mysnapshots" :key="item.id">
              <div class="icon-holder"></div>
              <h3>{{ item.name }}</h3>
              <p>为&quot;{{ item.originFtName }}&quot;于{{ item.createdTime }}创建</p>
              <div class="del-icon" @click="deleteSnapshot(item.id)"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import staticbase from '@/mixins/staticbase'
export default {
  name: 'SnapshotSummary',
  mixins: [staticbase],
  data() {
    return {
      blockingLicenseWindow: false,
      licenseCode: '',
      staticbaseknown: false,
      static_base: '.',
      rest_base: '.',
      wholePageLoading: false,
      mysnapshots: [],
    }
  },
  created() {
    this.getStaticBase()
  },
  mounted() {
    this.loadSnapshot()
    this.checkLicense()
  },
  methods: {
    loadSnapshot() {
      request
        .get('/api/v1/familytree/snapshot')
        .then((response) => {
          if (response.data.ok === true) {
            console.log(response.data.data)
            this.mysnapshots = response.data.data
          } else {
            this.$notify.error({
              title: '错误',
              message: '载入快照数据错误',
            })
            location.reload()
          }
        })
        .catch((e) => {
          this.$notify.error({
            title: '错误',
            message: '载入快照数据错误',
          })
          location.reload()
        })
    },
    deleteSnapshot(val) {
      this.$confirm('删除不可恢复，确认删除快照？')
        .then((_) => {
          this.wholePageLoading = true
          request
            .delete('/api/v1/familytree/snapshot/' + val)
            .then((response) => {
              if (response.data.ok === true) {
                this.$notify({
                  title: '成功',
                  message: '删除快照成功',
                  type: 'success',
                })
                this.wholePageLoading = false
                this.loadSnapshot()
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '删除快照出错',
                })
                this.wholePageLoading = false
              }
            })
            .catch((e) => {
              this.wholePageLoading = false
            })
        })
        .catch((_) => {})
    },
  },
}
</script>

<style scoped>
.snapshot-summary-page {
  position: absolute;
  left: 0;
  display: flex;
  flex-flow: column;
  width: 100%;
}
.snapshot-summary-content {
  width: 100%;
  min-height: 700px;
  background-color: #f1f4f5;
}
.center-content {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  min-height: 700px;
  margin: 0 auto;
  background-color: white;
  background-size: 100% 100%;
}
.snapshot-item-holder {
  width: 500px;
  margin: 0 auto;
}
ul {
  width: 500px;
  list-style-type: none;
}
h3 {
  font: bold 20px/1.5;
}
li .icon-holder {
  float: left;
  margin: 0 15px 0 0;
}
li p {
  font: 200 12px/1.5;
}
li {
  position: relative;
  padding: 10px;
  overflow: auto;
}
li:hover {
  cursor: pointer;
  background: #eee;
}
.icon-holder {
  width: 50px;
  height: 50px;
  background-image: url('@/assets/images/backupstore.png');
  background-size: 100% 100%;
  border: none;
}
.del-icon {
  position: absolute;
  top: 25px;
  left: 400px;
  width: 20px;
  height: 20px;
  background: url('@/assets/images/delete20.png') no-repeat;
  background-size: 100% 100%;
}
#snap-empty-placeholder {
  width: 400px;
  height: 108px;
  margin-left: 130px;
  background-image: url('@/assets/images/zanwukuaizhao.png');
  background-size: 100% 100%;
}
.place-taker {
  width: 100%;
  height: 100px;
}
#snap-title {
  width: 270px;
  height: 100px;
  margin: 0 auto;
  background-image: url('@/assets/images/snapshottitle.png');
  background-size: 100% 100%;
}
.bottom {
  flex: 1;
  background-color: #f3f0ec;
}
</style>
