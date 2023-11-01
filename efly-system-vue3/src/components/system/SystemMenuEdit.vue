<template>
  <el-dialog
    :model-value="visible"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
    :destroy-on-close="true"
    :title="activeTitle"
    width="680px"
  >
    <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="100px">
      <el-form-item label="上级菜单" prop="parentId">
        <el-tree-select
          v-model="editForm.parentId"
          :data="menuTree"
          :props="{value:'menuId',label:'menuName',children:'children'}"
          value-key="menuId"
          placeholder="选择上级菜单"
          :check-strictly="true"
          :render-after-expand="false"
          :default-expanded-keys="[0]"
          :disabled="isParentDisabled"
        />
      </el-form-item>
      <el-form-item label="菜单类型" prop="menuType">
        <el-radio-group v-model="editForm.menuType" @change="editFormRef.clearValidate()">
          <el-radio v-for="(val,key) in types" :key="key" :label="key">{{ val }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col v-if="isNeedIcon" :span="24">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover v-model:visible="showChooseIcon" placement="bottom-start" :width="540" trigger="click" @show="onSelectIconShow">
              <template #reference>
                <el-input v-model="editForm.icon" placeholder="点击选择图标" readonly v-click-outside="onSelectIconHide">
                  <template #prefix>
                    <svg-icon v-if="editForm.icon" :name="editForm.icon" class="el-input__icon" style="height:32px;width:16px;" />
                    <el-icon v-else class="el-input__icon" style="height:32px;width:16px;"><Search /></el-icon>
                  </template>
                </el-input>
              </template>
              <IconSelect ref="iconSelectRef" @selected="onIconSelected" />
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model.trim="editForm.menuName" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示排序" prop="orderNum">
            <el-input-number v-model="editForm.orderNum" :min="0" :max="9999" />
          </el-form-item>
        </el-col>
        <el-col v-if="isNeedApi" :span="24">
          <el-form-item prop="api">
            <template #label>
              <span>
                <el-tooltip placement="top" content="对应的后端接口，形如`/manage-api/user/login`">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>后端接口
              </span>
            </template>
            <el-input v-model.trim="editForm.api" placeholder="请输入对应后端接口，多个以`,`隔开" />
          </el-form-item>
        </el-col>
        <el-col v-if="isNeedIcon" :span="12">
          <el-form-item prop="path">
            <template #label>
              <span>
                <el-tooltip placement="top" content="访问的路由地址，如`/system/menu`，若外链访问则以`http(s)://`开头">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>路由地址
              </span>
            </template>
            <el-input v-model.trim="editForm.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col v-else :span="12">
          <el-form-item prop="permit">
            <template #label>
              <span>
                <el-tooltip placement="top" content="对应的前端标识，形如`system:menu:add`">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>权限标识
              </span>
            </template>
            <el-input v-model.trim="editForm.permit" placeholder="请输入权限标识" />
          </el-form-item>
        </el-col>
        <el-col v-if="editForm.menuType==='C'" :span="12">
          <el-form-item prop="component">
            <template #label>
              <span>
                <el-tooltip placement="top" content="对应的组件路径，如`system/MenuManage.vue`，默认在`views`目录下">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>组件路径
              </span>
            </template>
            <el-input v-model.trim="editForm.component" placeholder="请输入组件路径" />
          </el-form-item>
        </el-col>
        <el-col v-if="editForm.menuType==='M' || editForm.menuType==='C'" :span="12">
          <el-form-item prop="isMenu">
            <template #label>
              <span>
                <el-tooltip placement="top" content="选择`否`将不会出现在导航栏，但仍然可以访问">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>显示到导航
              </span>
            </template>
            <el-radio-group v-model="editForm.isMenu">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="editForm.menuType==='C'" :span="12">
          <el-form-item prop="isCached">
            <template #label>
              <span>
                <el-tooltip placement="top" content="选择`是`将被`keep-alive`缓存，对应组件需设置唯一`name`">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>是否缓存
              </span>
            </template>
            <el-radio-group v-model="editForm.isCached">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="isActivated">
            <template #label>
              <span>
                <el-tooltip placement="top" content="选择`否`将不会出现在导航栏，也不能访问，也没有对应接口权限">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>是否生效
              </span>
            </template>
            <el-radio-group v-model="editForm.isActivated">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button type="primary" :loading="isEditSubmit" @click="onSubmit()">
        {{ isAdd ? '提交' : '保存' }}{{ isEditSubmit ? '中...' : '' }}
      </el-button>
      <el-button :disabled="isEditSubmit" @click="closeDialog()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { QuestionFilled, Search } from '@element-plus/icons-vue'
import { ClickOutside } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { system_menu_add, system_menu_modify } from '@/api/system/menu'
import IconSelect from '@/components/IconSelect.vue'
export default defineComponent({
  name: 'SystemMenuEdit',
  components: {
    QuestionFilled,
    Search,
    IconSelect
  },
  directives: {
    ClickOutside
  },
  emits: ['update:visible', 'ok'],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    scene: {
      type: String,
      default: 'add',
      validator(val: string) {
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
      showChooseIcon: false,
      isEditSubmit: false,
      editForm: {
        menuId: undefined,
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
    editFormRef() {
      return this.$refs.editFormRef as FormInstance
    },
    iconSelectRef() {
      return this.$refs.iconSelectRef as InstanceType<typeof IconSelect>
    },
    activeTitle() {
      return { 'add': '添加菜单', 'modify': '修改菜单', 'template_add': '添加菜单' }[this.scene] || '未定义'
    },
    isAdd() {
      return ['add', 'template_add'].includes(this.scene)
    },
    isNeedIcon() {
      return ['M', 'C', 'L'].includes(this.editForm.menuType)
    },
    isNeedApi() {
      return ['C', 'A'].includes(this.editForm.menuType)
    },
    isParentDisabled() {
      return this.scene === 'add' && Object.keys(this.reshow).includes('parentId')
    },
  },
  created() {
    this.handleReshow()
  },
  methods: {
    closeDialog() {
      if (!this.isEditSubmit) {
        this.$emit('update:visible', false)
      }
    },
    handleReshow() {
      const reshow = { ...this.reshow }
      const keys = Object.keys(reshow)
      for (const field in this.editForm) {
        if (keys.includes(field)) {
          this.editForm[field] = reshow[field]
        }
      }
    },
    onSelectIconShow() {
      this.iconSelectRef.reset()
      this.showChooseIcon = true
    },
    onIconSelected(name: string) {
      this.editForm.icon = name
      this.showChooseIcon = false
    },
    onSelectIconHide(event: any) {
      const elem = event.relatedTarget || event.srcElement || event.target || event.currentTarget;
      if (elem.className !== 'el-input__inner') {
        this.showChooseIcon = false
      }
    },
    async onSubmit() {
      this.editFormRef.validate(async (valid) => {
        try {
          if (!valid) return
          await this.$modal.confirm(`菜单功能尤为重要，请谨慎操作。确认要执行本次“${this.activeTitle}”操作吗？`)
          const params = { ...this.editForm }
          if (this.isAdd) {
            delete params.menuId
          }
          this.isEditSubmit = true
          if (this.isAdd) {
            await system_menu_add(params)
          } else {
            await system_menu_modify(params)
          }
          this.isEditSubmit = false
          this.closeDialog()
          this.$emit('ok', '操作成功')
        } catch (error) {
          this.isEditSubmit = false
          console.log(error)
        }
      })
    }
  }
})
</script>
