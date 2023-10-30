<template>
  <el-dialog
    :visible="value"
    :title="isAdd ? '添加角色' : '编辑角色'"
    :append-to-body="true"
    :before-close="closeDialog"
    width="600px"
  >
    <el-form ref="formRef" :model="editForm" :rules="editFormRules" label-width="80px">
      <el-form-item prop="roleName" label="角色名称">
        <el-input v-model.trim="editForm.roleName" placeholder="请输入" />
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-radio-group v-model="editForm.status">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单权限" prop="roleMenu">
        <el-checkbox v-model="menuExpand" @change="onCheckedTreeExpand($event)">展开/折叠</el-checkbox>
        <el-checkbox v-model="menuNodeAll" @change="onCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
        <el-tree
          ref="permitTree"
          class="tree-border"
          :data="menuTree"
          :props="{label:'menuName',children:'children'}"
          :default-checked-keys="editForm.roleMenu"
          show-checkbox
          node-key="menuId"
        />
      </el-form-item>
      <el-form-item prop="remark" label="备注" style="margin-bottom:0;">
        <el-input v-model="editForm.remark" placeholder="请输入" type="textarea" :rows="3" resize="none" />
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
import { menu_simple_list, role_add, role_modify } from '@/api/system'
export default {
  name: 'RoleEdit',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    reshow: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      menuTree: [],
      menuExpand: false,
      menuNodeAll: false,
      isSubmit: false,
      editForm: {
        roleId: null,
        roleName: '',
        roleMenu: [],
        status: 0,
        remark: ''
      },
      editFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
      }
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.menuNodeAll = false
        this.menuExpand = false
        this.onCheckedTreeExpand(false)
        this.$refs.permitTree.setCheckedKeys([])
        return this.$refs.formRef.resetFields()
      }
      if (!this.isAdd) {
        this.$nextTick(() => {
          this.handleReshow()
        })
      }
    }
  },
  created() {
    this.getMenus()
  },
  methods: {
    closeDialog() {
      if (!this.isSubmit) {
        this.$emit('input', false)
      }
    },
    handleReshow() {
      const reshow = { ...this.reshow }
      if (reshow.roleMenu) {
        let menuIds = reshow.roleMenu.split(',').map(item => item * 1)
        const formatMenuReshow = (treeArr) => {
          treeArr.forEach(item => {
            if (item.children) {
              menuIds = menuIds.filter(i => i !== item.menuId)
              formatMenuReshow(item.children)
            }
          })
        }
        formatMenuReshow(this.menuTree)
        reshow.roleMenu = menuIds
      } else {
        reshow.roleMenu = []
      }
      const keys = Object.keys(reshow)
      for (const field in this.editForm) {
        if (keys.includes(field)) {
          this.editForm[field] = reshow[field]
        }
      }
    },
    async getMenus() {
      try {
        const { data } = await menu_simple_list()
        this.menuTree = data
      } catch (error) {
        console.log(error)
      }
    },
    onCheckedTreeExpand(value) {
      const treeList = this.menuTree
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.permitTree.store.nodesMap[treeList[i].menuId].expanded = value
      }
    },
    onCheckedTreeNodeAll(value) {
      this.$refs.permitTree.setCheckedNodes(value ? this.menuTree : [])
    },
    onSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return false
        const { remark, ...lastParams } = this.editForm
        const tree = this.$refs.permitTree
        lastParams.roleMenu = [...tree.getHalfCheckedKeys(), ...tree.getCheckedKeys()].toString()
        lastParams.remark = remark.trim()
        if (this.isAdd) {
          delete lastParams.roleId
        }
        this.handleSubmit(lastParams)
      })
    },
    async handleSubmit(params) {
      try {
        this.isSubmit = true
        if (this.isAdd) {
          await role_add(params)
        } else {
          await role_modify(params)
        }
        this.$emit('ok')
      } catch (error) {
        console.log(error)
      } finally {
        this.isSubmit = false
      }
    }
  }
}
</script>
