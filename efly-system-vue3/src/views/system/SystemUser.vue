<template>
  <MainCard>
    <template #header>
      <el-form ref="queryFormRef" :model="queryParams" inline>
        <el-form-item prop="status">
          <el-select v-model="queryParams.status" clearable placeholder="状态">
            <el-option :value="0" label="正常" />
            <el-option :value="1" label="已停用" />
          </el-select>
        </el-form-item>
        <el-form-item prop="keyword">
          <el-input v-model.trim="queryParams.keyword" clearable placeholder="账号/姓名/手机号码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="onQuery()">查询</el-button>
          <el-button :icon="Refresh" @click="onReset()">重置</el-button>
          <template v-if="$auth.hasPermit(['system:user:add'])">
            <el-button type="primary" :icon="Plus" @click="onEdit('add')">添加</el-button>
          </template>
        </el-form-item>
      </el-form>
    </template>
    <el-table v-loading="isLoading" :data="itemList" border>
      <el-table-column prop="userId" label="用户编号" min-width="80" />
      <el-table-column prop="userName" label="用户账号" min-width="120" />
      <el-table-column prop="realName" label="用户姓名" min-width="120" />
      <el-table-column prop="phone" label="手机号码" min-width="120" />
      <el-table-column prop="roleName" label="角色" min-width="200" />
      <el-table-column prop="status" label="状态" min-width="100" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status === 1" type="danger">已停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="170">
        <template #default="scope">
          {{ $utils.formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160">
        <template #default="scope">
          <template v-if="scope.row.isSystem === 1">
            <template v-if="$auth.hasPermit(['system:user:modify'])">
              <el-button type="primary" :icon="Edit" link @click="onEdit('modify', scope.row)">修改</el-button>
            </template>
            <template v-if="$auth.hasPermit(['system:user:delete'])">
              <el-button type="danger" :icon="Delete" link @click="onRemove(scope.row)">删除</el-button>
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:page="queryParams.currentPage"
      v-model:limit="queryParams.pageSize"
      :total="itemCount"
      @change="handleGetList"
    />
    <el-dialog
      v-model="editVisible"
      :append-to-body="true"
      :before-close="closeDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :draggable="true"
      :destroy-on-close="true"
      :title="isAdd ? '添加用户' : '编辑用户'"
      width="600px"
    >
      <el-form v-loading="isEditLoading" ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="userName" label="用户账号">
              <el-input v-model.trim="editForm.userName" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col v-if="isAdd" :span="12">
            <el-form-item prop="password" label="密码">
              <el-input v-model="editForm.password" placeholder="请输入" show-password autocomplete="new-password" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="realName" label="用户姓名">
              <el-input v-model.trim="editForm.realName" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="phone" label="手机号码">
              <el-input v-model.trim="editForm.phone" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item prop="role" label="用户角色">
          <el-checkbox-group v-model="editForm.role">
            <el-checkbox v-for="x in roleList" :key="x.roleId" :label="x.roleId">{{ x.roleName }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="status" label="用户状态" style="margin-bottom: 0">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" :loading="isEditSubmit" @click="onSubmit()">
          {{ isAdd ? '提交' : '保存' }}{{ isEditSubmit ? '中...' : '' }}
        </el-button>
        <el-button :disabled="isEditSubmit" @click="closeDialog()">取消</el-button>
      </template>
    </el-dialog>
  </MainCard>
</template>

<script setup lang="ts" name="SystemUser">
import { Search, Refresh, Plus, Edit, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import modal from '@/plugins/modal'
import { DEFAULT_PAGE_SIZE } from '@/config/constantValues'
import SystemUserService from '@/api/system/user'
import SystemRoleService from '@/api/system/role'
import md5 from 'blueimp-md5'

type EditType = 'add' | 'modify'
interface RoleItem {
  roleId: number
  roleName: string
}
interface ListItem {
  userId: number
  userName: string
  realName: string
  phone: string
  role: RoleItem[]
  roleName: string
  status: number
  createTime: string
  isSystem: number
}

const queryFormRef = ref<FormInstance>()
const queryParams = reactive({
  pageSize: DEFAULT_PAGE_SIZE,
  currentPage: 1,
  status: '',
  keyword: '',
})
const isLoading = ref(false)
const itemList = ref<ListItem[]>([])
const itemCount = ref(0)

const editVisible = ref(false)
const editType = ref<EditType>('add')
const isAdd = computed(() => {
  return editType.value === 'add'
})

const roleList = ref<RoleItem[]>([])
const isEditLoading = ref(false)
const isEditSubmit = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive<{
  userId?: number | null
  userName: string
  password?: string
  realName: string
  phone: string
  role: number[]
  status: number
}>({
  userId: null,
  userName: '',
  password: '',
  realName: '',
  phone: '',
  role: [],
  status: 0,
})
const editFormRules = reactive<FormRules>({
  userName: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur',
    },
  ],
  role: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
})

async function handleGetList() {
  try {
    isLoading.value = true
    const { data } = await SystemUserService.list<ListItem>(queryParams)
    itemList.value = data.rows.map((item: ListItem) => {
      item.roleName = String((item.role || []).map((item) => item.roleName))
      return item
    })
    itemCount.value = data.count
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}
function onQuery() {
  queryParams.currentPage = 1
  handleGetList()
}
function onReset() {
  if (queryFormRef.value) {
    queryFormRef.value.resetFields()
    onQuery()
  }
}

async function onRemove(row: ListItem) {
  try {
    await modal.confirm(`确认删除账号为“${row.userName}”的用户吗？`)
    isLoading.value = true
    await SystemUserService.remove({ userId: row.userId })
    modal.msgSuccess('删除成功')
    handleGetList()
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

function onEdit(type: EditType, row?: ListItem) {
  editType.value = type
  editVisible.value = true
  isEditLoading.value = true
  SystemRoleService.listSimple<RoleItem[]>().then(res => {
    isEditLoading.value = false
    roleList.value = res.data
    if (type === 'modify' && row) {
      nextTick(() => {
        handleEditReshow(row)
      })
    }
  }).catch(() => {
    isEditLoading.value = false
    closeDialog()
  })
}

function closeDialog() {
  if (!isEditSubmit.value) {
    handleEditReset()
    editVisible.value = false
  }
}
function handleEditReset() {
  editForm.password = ''
  editFormRef.value?.resetFields()
}
function handleEditReshow(row: ListItem) {
  const data = { ...row }
  const keys = Object.keys(data)
  for (const field in editForm) {
    if (keys.includes(field)) {
      if (field === 'role') {
        editForm[field] = data.role ? data.role.map((item: RoleItem) => item.roleId) : []
      } else {
        editForm[field] = data[field]
      }
    }
  }
}
function onSubmit() {
  if (!editFormRef.value) return
  editFormRef.value.validate(async (valid) => {
    try {
      if (!valid) return
      const lastParams = {
        ...editForm,
        role: editForm.role.toString()
      }
      if (isAdd.value) {
        delete lastParams.userId
      } else {
        delete lastParams.password
      }
      if (lastParams.password) {
        lastParams.password = md5(lastParams.password)
      }
      isEditSubmit.value = true
      if (isAdd.value) {
        await SystemUserService.add(lastParams)
        modal.msgSuccess('提交成功')
      } else {
        await SystemUserService.modify(lastParams)
        modal.msgSuccess('保存成功')
      }
      isEditSubmit.value = false
      closeDialog()
      handleGetList()
    } catch (error) {
      isEditSubmit.value = false
      console.log(error)
    }
  })
}

onQuery()
</script>
