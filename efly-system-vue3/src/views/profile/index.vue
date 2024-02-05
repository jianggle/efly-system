<template>
  <TableCard>
    <el-tabs v-model="activeTab" tab-position="left" class="user-profile-tabs">
      <el-tab-pane name="profile" label="个人信息">
        <div class="user-profile-card">
          <h3>个人信息</h3>
          <ModifyAvatar />
          <el-descriptions :column="1">
            <el-descriptions-item label="用户账号">{{ info.userName }}</el-descriptions-item>
            <el-descriptions-item label="用户姓名">{{ info.realName }}</el-descriptions-item>
            <el-descriptions-item label="手机号码">{{ info.phone }}</el-descriptions-item>
            <el-descriptions-item label="所属角色">{{ infoRole }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ $utils.formatDate(info.createTime) }}</el-descriptions-item>
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

<script setup lang="ts">
import ModifyAvatar from './ModifyAvatar.vue'
import ModifyInfo from './ModifyInfo.vue'
import ModifyPwd from './ModifyPwd.vue'
import LogLogin from './LogLogin.vue'
import { system_account_info } from '@/api/system'

defineOptions({
  name: 'PageProfile',
})

const activeTab = ref('profile')
const info = ref({
  userName: '',
  realName: '',
  phone: '',
  createTime: '',
  role: [] as Array<{ roleName: string }>,
})
const infoRole = computed(() => {
  return String((info.value.role || []).map((item) => item.roleName))
})

const onRefresh = () => {
  activeTab.value = 'profile'
  handleGetInfo()
}

const handleGetInfo = () => {
  system_account_info<any>().then((res) => {
    info.value = res.data
  })
}

handleGetInfo()
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
