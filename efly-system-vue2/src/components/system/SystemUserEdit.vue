<template>
  <el-dialog
    :visible="value"
    :title="isAdd ? '添加用户' : '编辑用户'"
    :append-to-body="true"
    :before-close="closeDialog"
    width="600px"
  >
    <el-form ref="formRef" :model="editForm" :rules="editFormRules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item prop="userName" label="用户账号">
            <el-input v-model.trim="editForm.userName" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col v-if="isAdd" :span="12">
          <el-form-item prop="password" label="密码">
            <el-input v-model="editForm.password" placeholder="请输入" show-password />
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
          <el-checkbox v-for="x in roleItems" :key="x.roleId" :label="x.roleId">
            {{ x.roleName }}
          </el-checkbox>
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
      <el-button type="primary" :loading="isSubmit" @click="onSubmit()">
        {{ isAdd ? '提交' : '保存' }}{{ isSubmit ? '中...' : '' }}
      </el-button>
      <el-button :disabled="isSubmit" @click="closeDialog()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { role_simple_list, user_add, user_modify } from '@/api/system'
import md5 from 'blueimp-md5'
export default {
  name: 'SystemUserEdit',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Boolean,
      default: true,
    },
    reshow: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      roleItems: [],
      isSubmit: false,
      editForm: {
        userId: null,
        userName: '',
        password: '',
        realName: '',
        phone: '',
        role: [],
        status: 0,
      },
      editFormRules: {
        userName: [{ required: true, message: '请输入用户账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        realName: [{ required: true, message: '请输入用户姓名', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
        ],
        role: [{ required: true, message: '请选择用户角色', trigger: 'change' }],
      },
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.editForm.password = ''
        return this.$refs.formRef.resetFields()
      }
      if (!this.isAdd) {
        this.$nextTick(() => {
          this.handleReshow()
        })
      }
    },
  },
  created() {
    this.getRoles()
  },
  methods: {
    closeDialog() {
      if (!this.isSubmit) {
        this.$emit('input', false)
      }
    },
    handleReshow() {
      const { role, ...reshow } = this.reshow
      reshow.role = role ? role.map((item) => item.roleId) : []
      const keys = Object.keys(reshow)
      for (const field in this.editForm) {
        if (keys.includes(field)) {
          this.editForm[field] = reshow[field]
        }
      }
    },
    async getRoles() {
      try {
        const { data } = await role_simple_list()
        this.roleItems = data
      } catch (error) {
        console.log(error)
      }
    },
    onSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return false
        const { role, ...lastParams } = this.editForm
        lastParams.role = role.toString()
        if (this.isAdd) {
          delete lastParams.userId
        } else {
          delete lastParams.password
        }
        if (lastParams.password) {
          lastParams.password = md5(lastParams.password)
        }
        this.handleSubmit(lastParams)
      })
    },
    async handleSubmit(params) {
      try {
        this.isSubmit = true
        if (this.isAdd) {
          await user_add(params)
        } else {
          await user_modify(params)
        }
        this.$emit('ok')
      } catch (error) {
        console.log(error)
      } finally {
        this.isSubmit = false
      }
    },
  },
}
</script>
