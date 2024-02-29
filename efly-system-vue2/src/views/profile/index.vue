<template>
  <TableCard>
    <el-tabs v-model="activeTab" tab-position="left" class="user-profile-tabs">
      <el-tab-pane name="profile" label="个人信息">
        <div class="user-profile-card">
          <h3>个人信息</h3>
          <ModifyAvatar />
          <el-descriptions :column="1">
            <el-descriptions-item label="用户账号">
              {{ info.userName }}
            </el-descriptions-item>
            <el-descriptions-item label="用户姓名">
              {{ info.realName }}
            </el-descriptions-item>
            <el-descriptions-item label="手机号码">
              {{ info.phone }}
            </el-descriptions-item>
            <el-descriptions-item label="所属角色">
              {{ infoRole }}
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">
              {{ $utils.formatDate(info.createTime) }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>
      <el-tab-pane name="log" label="登录日志">
        <div class="user-profile-card" style="max-width: 100%">
          <h3>登录日志</h3>
          <LogLogin />
        </div>
      </el-tab-pane>
      <el-tab-pane name="info" label="编辑资料">
        <div class="user-profile-card">
          <h3>编辑资料</h3>
          <ModifyInfo :reshow="info" @ok="onRefresh" />
        </div>
      </el-tab-pane>
      <el-tab-pane name="pwd" label="修改密码">
        <div class="user-profile-card">
          <h3>修改密码</h3>
          <ModifyPwd />
        </div>
      </el-tab-pane>
    </el-tabs>
  </TableCard>
</template>

<script>
import { user_info } from '@/api/system'
import ModifyAvatar from './ModifyAvatar.vue'
import ModifyInfo from './ModifyInfo.vue'
import ModifyPwd from './ModifyPwd.vue'
import LogLogin from './LogLogin.vue'
export default {
  name: 'PageProfile',
  components: {
    ModifyAvatar,
    ModifyInfo,
    ModifyPwd,
    LogLogin,
  },
  data() {
    return {
      info: {},
      activeTab: 'profile',
    }
  },
  computed: {
    infoRole() {
      return String((this.info.role || []).map((item) => item.roleName))
    },
  },
  created() {
    this.handleGetInfo()
  },
  methods: {
    onRefresh() {
      this.activeTab = this.$options.data().activeTab
      this.handleGetInfo()
    },
    handleGetInfo() {
      user_info().then((res) => {
        this.info = res.data
      })
    },
  },
}
</script>

<style lang="scss">
.user-profile-tabs {
  .el-tabs__header {
    margin-right: 30px !important;
  }
  .el-tabs__item {
    padding: 0 30px;
  }
}
.user-profile-card {
  max-width: 420px;
  > h3 {
    margin-bottom: 12px;
    font-size: 20px;
    font-weight: normal;
  }
}
</style>
