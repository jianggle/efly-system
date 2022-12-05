<template>
  <el-dialog
    :model-value="visibleDialog"
    :append-to-body="true"
    :before-close="closeDialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :title="(isAdd ? '添加' : '编辑')+activeTitle"
    fullscreen
    center
    custom-class="edit-article-wrapper"
  >
    <el-form ref="editFormRef" :model="editForm" :rules="editFormRules">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="title">
            <el-input v-model.trim="editForm.title" placeholder="请输入标题..." />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <KindEditor v-if="visibleDialog" v-model="editForm.content" />
          <div style="height:20px" />
        </el-col>
        <el-col v-if="isArticle" :span="24">
          <el-form-item label-width="80px" prop="sortid" label="文章分类">
            <el-cascader
              v-model="editForm.sortid"
              :options="categoryList"
              :props="{label:'sortname',value:'sid'}"
              placeholder="请选择分类..."
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="80px" prop="tags" :label="activeTitle+'标签'">
            <el-tag v-for="(tag, index) in editForm.tags" :key="'t'+index" closable @close="onTagRemove(tag)">{{ tag }}</el-tag>
            <template v-if="isTagMore">
              <el-input
                v-if="tagInputVisible"
                ref="tagInputRef"
                v-model="tagInputVal"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="onTagInputConfirm"
                @blur="onTagInputConfirm"
              />
              <el-button v-else class="button-new-tag" :icon="Plus" size="small" @click="onTagInputShow">添加标签</el-button>
            </template>
            <h4>常用标签</h4>
            <el-tag v-for="tag in dynamicTags" :key="tag.tid" :effect="tag.effect" @click="onTagAdd(tag.tagname)">{{ tag.tagname }}</el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-button type="primary" link @click="showMoreEdit=!showMoreEdit">
            {{ showMoreEdit ? '收起' : '展开' }}高级选项
            <el-icon class="el-icon--right">
              <CaretTop v-if="showMoreEdit" />
              <CaretBottom v-else />
            </el-icon>
          </el-button>
        </el-col>
      </el-row>
      <el-row v-show="showMoreEdit">
        <el-col :span="24">
          <el-form-item label-width="80px" prop="excerpt" :label="activeTitle+'摘要'">
            <el-input v-model="editForm.excerpt" type="textarea" :autosize="{ maxRows: 3}" resize="none" placeholder="请输入摘要..." />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="80px" prop="alias" :label="activeTitle+'别名'">
            <el-input v-model.trim="editForm.alias" :placeholder="`用于自定义该${activeTitle}的链接地址`" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="80px" label="其他设置">
            <el-checkbox v-model="editForm.allowRemark">允许评论</el-checkbox>
            <template v-if="isArticle">
              <el-checkbox v-model="editForm.top">全局置顶</el-checkbox>
              <el-checkbox v-model="editForm.sortop">分类置顶</el-checkbox>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <template v-if="isAdd">
        <el-button :loading="isEditSubmit" @click="onSubmit(false)">存为草稿</el-button>
        <el-button type="primary" :loading="isEditSubmit" @click="onSubmit(true)">发布</el-button>
      </template>
      <template v-else>
        <el-button v-if="editForm.hide" :loading="isEditSubmit" @click="onSubmit(false)">保存</el-button>
        <el-button type="primary" :loading="isEditSubmit" @click="onSubmit(true)">
          {{ editForm.hide ? '发布' : '保存' }}
        </el-button>
      </template>
      <el-button :disabled="isEditSubmit" @click="closeDialog()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="CmsArticleEdit">
import { Plus, CaretTop, CaretBottom } from '@element-plus/icons-vue'
import { ElInput } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import modal from '@/plugins/modal'
import { aliasValidator } from '@/utils/validator'
import { cms_article_info, cms_article_add, cms_article_modify } from '@/api/cms/article'
import KindEditor from '@/components/KindEditor.vue'

const props = defineProps({
  modelValue: {
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
})

const visibleDialog = toRef(props, 'modelValue')
const emit = defineEmits(['update:modelValue', 'ok'])
function closeDialog() {
  if (!isEditSubmit.value) {
    handleEditReset()
    emit('update:modelValue', false)
  }
}
watch(visibleDialog, (val: boolean) => {
  if (val) {
    handleEditReshow()
  }
})

interface TagItem {
  tid: number
  tagname: string
  effect: string
}

const isEditSubmit = ref(false)
const editFormRef = ref<FormInstance>()
const editForm = reactive({
  gid: undefined,
  title: '',
  content: '',
  excerpt: '',
  alias: '',
  sortid: [],
  type: 'blog',
  hide: false,
  allowRemark: true,
  top: false,
  sortop: false,
  tags: [] as string[],
})
const editFormRules = reactive<FormRules>({
  title: { required: true, message: '请输入标题', trigger: 'blur' },
  sortid: { required: true, message: '请选择分类', trigger: 'change' },
  alias: { validator: aliasValidator, trigger: 'blur' },
})

const categoryList = ref([])
const regularTags = ref<TagItem[]>([])
const tagInputVisible = ref(false)
const tagInputRef = ref<InstanceType<typeof ElInput>>()
const tagInputVal = ref('')
const showMoreEdit = ref(false)

const isArticle = computed(() => {
  return props.reshow.type === 'blog'
})
const activeTitle = computed(() => {
  return isArticle.value ? '文章' : '页面'
})
const dynamicTags = computed(() => {
  return regularTags.value.map(item => {
    return {
      ...item,
      effect: editForm.tags.includes(item.tagname) ? 'dark' : 'plain'
    }
  })
})
const isTagMore = computed(() => {
  return editForm.tags.length < 5
})

function handleEditReset() {
  editForm.content = ''
  editForm.allowRemark = true
  editForm.top = false
  editForm.sortop = false
  editFormRef.value!.resetFields()
}
async function handleEditReshow() {
  try {
    const gid = props.isAdd ? null : props.reshow.gid
    const { data } = await cms_article_info<any>({ gid })
    categoryList.value = data.optionCategories
    regularTags.value = data.optionTags
    if (!props.isAdd) {
      const keys = Object.keys(data)
      for (const field in editForm) {
        if (!keys.includes(field)) continue
        if (['hide', 'allowRemark', 'top', 'sortop'].includes(field)) {
          editForm[field] = data[field] === 'y'
        } else {
          editForm[field] = data[field]
        }
      }
    } else {
      editForm.type = props.reshow.type
    }
  } catch (error) {
    console.log(error)
  }
}

function onTagAdd(tag: string) {
  const { tags } = editForm
  if (!tags.includes(tag) && isTagMore.value) {
    editForm.tags.push(tag)
  }
}
function onTagRemove(tag: string) {
  editForm.tags.splice(editForm.tags.indexOf(tag), 1)
}
function onTagInputShow() {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value!.input!.focus()
  })
}
function onTagInputConfirm() {
  const val = tagInputVal.value.trim()
  if (val) {
    onTagAdd(val)
  }
  tagInputVisible.value = false
  tagInputVal.value = ''
}

async function onSubmit(_status: boolean) {
  if (!editFormRef.value) return
  editFormRef.value.validate(async (valid) => {
    try {
      if (!valid) return
      const { sortid: catids } = editForm
      const params = {
        ...editForm,
        hide: !_status,
        sortid: Array.isArray(catids) ? (catids.length > 0 ? catids[catids.length - 1] : null) : catids,
        tags: [ ...editForm.tags ]
      }
      if (props.isAdd) {
        delete params.gid
      }
      isEditSubmit.value = true
      if (props.isAdd) {
        await cms_article_add(params)
      } else {
        await cms_article_modify(params)
      }
      modal.msgSuccess('操作成功')
      isEditSubmit.value = false
      closeDialog()
      emit('ok')
    } catch (error) {
      isEditSubmit.value = false
      console.log(error)
    }
  })
}
</script>

<style lang="scss">
.edit-article-wrapper {
  width: 720px!important;
  display: flex;
  flex-direction: column;
  .el-dialog__body {
    flex: 1;
    overflow: auto;
    .el-tag {
      margin-right: 6px;
    }
    .button-new-tag {
      margin-right: 6px;
    }
    .input-new-tag {
      width: 90px;
      margin-right: 6px;
    }
  }
}
</style>
