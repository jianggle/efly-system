<template>
  <el-dialog
    :visible="visible"
    :title="activeTitle"
    :append-to-body="true"
    :before-close="closeDialog"
    width="680px"
  >
    <el-form ref="formRef" :model="editForm" :rules="editFormRules" label-width="100px">
      <el-form-item label="上级菜单" prop="parentId">
        <TreeSelect
          v-model="editForm.parentId"
          :options="menuTree"
          :normalizer="{id:'menuId',label:'menuName',children:'children'}"
          :disabled="isParentDisabled"
          placeholder="选择上级菜单"
        />
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="editForm.menuType" @change="$refs.formRef.clearValidate()">
          <el-radio v-for="(val,key) in types" :key="key" :label="key">{{val}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="24" v-if="isNeedIcon">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover
              placement="bottom-start"
              width="460"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <MenuIconSelect ref="iconSelect" @selected="editForm.icon=$event" />
              <el-input slot="reference" v-model="editForm.icon" placeholder="点击选择图标" readonly>
                <svg-icon v-if="editForm.icon" slot="prefix" :name="editForm.icon" class="el-input__icon"/>
                <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
              </el-input>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="editForm.menuName" placeholder="请输入菜单名称"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="editForm.orderNum" :min="0" :max="9999" />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="isNeedApi">
          <el-form-item prop="api">
            <span slot="label">
              <el-tooltip content="对应的后端接口，形如`/manage-api/user/login`" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>后端接口
            </span>
            <el-input v-model.trim="editForm.api" placeholder="请输入对应后端接口，多个以`,`隔开"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isNeedIcon">
          <el-form-item prop="path">
            <span slot="label">
              <el-tooltip content="访问的路由地址，如`/system/menu`，若外链访问则以`http(s)://`开头" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>路由地址
            </span>
            <el-input v-model.trim="editForm.path" placeholder="请输入路由地址"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-else>
          <el-form-item prop="permit">
            <span slot="label">
              <el-tooltip content="对应的前端标识，形如`system:menu:add`" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>权限标识
            </span>
            <el-input v-model.trim="editForm.permit" placeholder="请输入权限标识"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="editForm.menuType==='C'">
          <el-form-item prop="component">
            <span slot="label">
              <el-tooltip content="对应的组件路径，如`system/MenuManage.vue`，默认在`views`目录下" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>组件路径
            </span>
            <el-input v-model.trim="editForm.component" placeholder="请输入组件路径"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="editForm.menuType==='M' || editForm.menuType==='C'">
          <el-form-item prop="isMenu">
            <span slot="label">
              <el-tooltip content="选择`否`将不会出现在导航栏，但仍然可以访问" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>显示到导航
            </span>
            <el-radio-group v-model="editForm.isMenu">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="editForm.menuType==='C'">
          <el-form-item prop="isCached">
            <span slot="label">
              <el-tooltip content="选择`是`将被`keep-alive`缓存，对应组件需设置唯一`name`" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>是否缓存
            </span>
            <el-radio-group v-model="editForm.isCached">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="isActivated">
            <span slot="label">
              <el-tooltip content="选择`否`将不会出现在导航栏，也不能访问，也没有对应接口权限" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>是否生效
            </span>
            <el-radio-group v-model="editForm.isActivated">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
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
import { menu_add, menu_modify } from '@/api/systemMenu'
import TreeSelect from '@/components/TreeSelect.vue'
import MenuIconSelect from './MenuIconSelect.vue'
export default {
  name: 'MenuEdit',
  components: {
    TreeSelect,
    MenuIconSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    scene: {
      type: String,
      default: 'add',
      validator(val) {
        return ['add', 'template_add', 'modify'].includes(val)
      }
    },
    types: {
      type: Object,
      default: () => {
        return {}
      }
    },
    reshow: {
      type: Object,
      default: () => {
        return {}
      }
    },
    menuTree: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isSubmit: false,
      editForm: {
        menuId: null,
        parentId: 0,
        menuType: 'M',
        menuName: '',
        icon: '',
        path: '',
        component: '',
        permit: '',
        api: '',
        isMenu: 0,
        isCached: 1,
        isActivated: 0,
        orderNum: 0,
      },
      editFormRules: {
        menuName: [{ required: true, message: '请输入', trigger: 'blur' }],
        path: [{ required: true, message: '请输入', trigger: 'blur' }],
        component: [{ required: true, message: '请输入', trigger: 'blur' }],
        permit: [{ required: true, message: '请输入', trigger: 'blur' }],
      }
    }
  },
  computed: {
    activeTitle() {
      return {
        'add': '添加菜单',
        'modify': '修改菜单',
        'template_add': '添加菜单',
      } [this.scene] || '未定义'
    },
    isAdd() {
      return ['add', 'template_add'].includes(this.scene)
    },
    isNeedIcon() {
      return ['M', 'C', 'L'].includes(this.editForm.menuType)
    },
    isNeedApi() {
      return ['C', 'A', 'G'].includes(this.editForm.menuType)
    },
    isParentDisabled() {
      return this.scene === 'add' && Object.keys(this.reshow).includes('parentId')
    }
  },
  created() {
    this.handleReshow()
  },
  methods: {
    closeDialog() {
      if (!this.isSubmit) {
        this.$emit('update:visible', false)
      }
    },
    handleReshow() {
      const reshow = this.$utils.deepClone(this.reshow)
      const keys = Object.keys(reshow)
      for (let field in this.editForm) {
        if (keys.includes(field)) {
          this.editForm[field] = reshow[field]
        }
      }
    },
    onSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return false
        let lastParams = this.$utils.deepClone(this.editForm)
        if (this.isNeedIcon) {
          lastParams.permit = null
        } else {
          lastParams.icon = lastParams.path = lastParams.component = null
          lastParams.isMenu = lastParams.isCached = null
        }
        if (lastParams.menuType === 'M') {
          lastParams.component = 'layout'
          lastParams.isCached = 1
        }
        if (lastParams.menuType === 'L') {
          lastParams.isCached = null
        }
        if (!this.isNeedApi) {
          lastParams.api = null
        }
        if (this.isAdd) {
          delete lastParams.menuId
        }
        this.handleSubmit(lastParams)
      })
    },
    async handleSubmit(params) {
      try {
        let tipMsg = `菜单功能尤为重要，请谨慎操作。<br/>确认要执行本次“${this.activeTitle}”操作吗？`
        await this.$confirm(tipMsg, '温馨提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true
        })
        this.isSubmit = true
        if (this.isAdd) {
          await menu_add(params)
        } else {
          await menu_modify(params)
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
