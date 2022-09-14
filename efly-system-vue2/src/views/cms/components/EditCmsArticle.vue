<template>
  <el-dialog
    :title="(isAdd ? '添加' : '编辑')+activeTitle"
    :visible.sync="value"
    append-to-body
    center
    fullscreen
    :before-close="closeDialog"
    custom-class="edit-article-wrapper"
  >
    <el-form ref="formRef" :model="editForm" :rules="editFormRules">
      <el-row>
        <el-col :span="24">
          <el-form-item prop="title">
            <el-input v-model.trim="editForm.title" placeholder="请输入标题..." />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <KindEditor v-if="value" v-model="editForm.content" />
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
            <el-tag
              v-for="(tag, index) in editForm.tags"
              :key="'t'+index"
              closable
              @close="onTagRemove(tag)"
            >
              {{ tag }}
            </el-tag>
            <template v-if="isTagMore">
              <el-input
                v-if="tagInputVisible"
                ref="saveTagInput"
                v-model="tagInputVal"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="tagInputConfirm"
                @blur="tagInputConfirm"
              />
              <el-button
                v-else
                class="button-new-tag"
                icon="el-icon-plus"
                size="small"
                @click="tagShowInput"
              >
                添加标签
              </el-button>
            </template>
            <h4>常用标签</h4>
            <el-tag
              v-for="tag in dynamicTags"
              :key="tag.tid"
              :effect="tag.effect"
              @click="onTagAdd(tag.tagname)"
            >
              {{ tag.tagname }}
            </el-tag>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-link type="primary" :underline="false" @click="showMoreEdit=!showMoreEdit">
            {{ showMoreEdit ? '收起' : '展开' }}高级选项
            <i class="el-icon--right" :class="showMoreEdit?'el-icon-caret-top':'el-icon-caret-bottom'" />
          </el-link>
        </el-col>
      </el-row>
      <el-row v-show="showMoreEdit">
        <el-col :span="24">
          <el-form-item label-width="80px" prop="excerpt" :label="activeTitle+'摘要'">
            <el-input
              v-model="editForm.excerpt"
              type="textarea"
              :autosize="{ maxRows: 3}"
              resize="none"
              placeholder="请输入摘要..."
            />
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
        <el-button :loading="isSubmit" @click="onSubmit(false)">存为草稿</el-button>
        <el-button type="primary" :loading="isSubmit" @click="onSubmit(true)">发布</el-button>
      </template>
      <template v-else>
        <el-button v-if="editForm.hide" :loading="isSubmit" @click="onSubmit(false)">保存</el-button>
        <el-button type="primary" :loading="isSubmit" @click="onSubmit(true)">
          {{ editForm.hide ? '发布' : '保存' }}
        </el-button>
      </template>
      <el-button :disabled="isSubmit" @click="closeDialog()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { info_cms_article, add_cms_article, modify_cms_article } from '@/api/cms'
import KindEditor from '@/components/KindEditor.vue'
import { aliasValidator } from '@/utils/validator'
export default {
  name: 'EditCmsArticle',
  components: {
    KindEditor
  },
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
      isSubmit: false,
      editForm: {
        gid: null,
        title: '',
        content: '',
        excerpt: '',
        alias: '',
        sortid: null,
        type: 'blog',
        hide: false,
        allowRemark: true,
        top: false,
        sortop: false,
        tags: [],
      },
      editFormRules: {
        title: { required: true, message: '请输入标题', trigger: 'blur' },
        sortid: { required: true, message: '请选择分类', trigger: 'change' },
        alias: { validator: aliasValidator, trigger: 'blur' },
      },
      categoryList: [],
      regularTags: [],
      tagInputVisible: false,
      tagInputVal: '',
      showMoreEdit: false,
    }
  },
  computed: {
    isArticle() {
      return this.reshow.type === 'blog'
    },
    activeTitle() {
      return this.isArticle ? '文章' : '页面'
    },
    dynamicTags() {
      return this.regularTags.map(item => {
        item.effect = this.editForm.tags.includes(item.tagname) ? 'dark' : 'plain'
        return item
      })
    },
    isTagMore() {
      return this.editForm.tags.length < 5
    }
  },
  watch: {
    value(val) {
      if (!val) {
        this.showMoreEdit = this.$options.data().showMoreEdit
        Object.assign(this.editForm, this.$options.data().editForm)
        return this.$refs.formRef.resetFields()
      }
      this.getInfo()
    }
  },
  methods: {
    closeDialog() {
      if (!this.isSubmit) {
        this.$emit('input', false)
      }
    },
    async getInfo() {
      try {
        const gid = this.isAdd ? null : this.reshow.gid
        const { data } = await info_cms_article({ gid })
        this.categoryList = data.optionCategories
        this.regularTags = data.optionTags
        if (!this.isAdd) {
          const keys = Object.keys(data)
          for (const field in this.editForm) {
            if (!keys.includes(field)) continue
            if (['hide', 'allowRemark', 'top', 'sortop'].includes(field)) {
              this.editForm[field] = data[field] === 'y'
            } else {
              this.editForm[field] = data[field]
            }
          }
        } else {
          this.editForm.type = this.reshow.type
        }
      } catch (error) {
        console.log(error)
      }
    },

    onTagAdd(tag) {
      const { tags } = this.editForm
      if (!tags.includes(tag) && this.isTagMore) {
        this.editForm.tags.push(tag)
      }
    },
    onTagRemove(tag) {
      this.editForm.tags.splice(this.editForm.tags.indexOf(tag), 1)
    },
    tagShowInput() {
      this.tagInputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    tagInputConfirm() {
      const tagInputVal = this.tagInputVal.trim()
      if (tagInputVal) {
        this.onTagAdd(tagInputVal)
      }
      this.tagInputVisible = false
      this.tagInputVal = ''
    },

    async onSubmit(_status) {
      try {
        await this.$refs.formRef.validate()
        const params = { ...this.editForm }
        if (this.isAdd) {
          delete params.gid
        }
        if (Array.isArray(params.sortid)) {
          params.sortid = params.sortid[params.sortid.length - 1]
        }
        params.hide = !_status

        this.isSubmit = true
        if (this.isAdd) {
          await add_cms_article(params)
        } else {
          await modify_cms_article(params)
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

<style lang="scss">
.edit-article-wrapper {
  display: flex;
  flex-direction: column;

  .el-dialog__body {
    flex: 1;
    overflow: auto;

    >.el-form {
      width: 50%;
      margin: 0 auto;
    }

    .el-tag {
      margin-right: 6px;
    }
    .button-new-tag {
      margin-right: 6px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-right: 6px;
      vertical-align: bottom;
    }
  }
}
</style>
