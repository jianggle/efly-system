<template>
  <el-form ref="formRef" :model="editForm" :rules="editFormRules">
    <el-form-item prop="realName" label="用户姓名">
      <el-input v-model="editForm.realName" maxlength="30" />
    </el-form-item>
    <el-form-item prop="phone" label="手机号码">
      <el-input v-model="editForm.phone" maxlength="11" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :loading="isSubmit" @click="onSubmit()">
        保存{{ isSubmit ? '中...' : '' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { user_modify_info } from '@/api/systemBase'
export default {
  name: 'UserModifyInfo',
  props: {
    reshow: {
      type: Object
    }
  },
  data() {
    return {
      isSubmit: false,
      editForm: {
        realName: '',
        phone: '',
      },
      editFormRules: {
        realName: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    reshow(val) {
      this.handleReshow()
    }
  },
  methods: {
    handleReshow() {
      const keys = Object.keys(this.reshow)
      for (let field in this.editForm) {
        if (keys.includes(field)) {
          this.editForm[field] = this.reshow[field]
        }
      }
    },
    async onSubmit() {
      try {
        await this.$refs.formRef.validate()
        this.isSubmit = true
        await user_modify_info(this.editForm)
        this.$emit('ok')
        this.$store.commit('user/UPDATE_USER_NAME', this.editForm.realName)
        this.$message.success('修改成功')
      } catch (error) {
        console.log(error)
      } finally {
        this.isSubmit = false
      }
    }
  }
}
</script>
