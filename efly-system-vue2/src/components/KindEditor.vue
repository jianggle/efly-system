<template>
  <div>
    <textarea
      :id="dynamicId"
      v-model="value"
      style="visibility:hidden;"
    />
    <input
      ref="fileRef"
      type="file"
      accept="image/jpg,image/jpeg,image/png,image/gif"
      style="display:none;"
      @change="onFileChange"
    >
  </div>
</template>

<script>
import { publicPath } from '@/config'
import { blog_upload_file } from '@/api/blog'
export default {
  name: 'KindEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 480
    },
  },
  data() {
    return {
      dynamicId: 'editor' + Date.now(),
      editor: null,
    }
  },
  watch: {
    value: {
      handler(value) {
        if (this.editor) {
          if (value !== this.editor.html()) {
            this.editor.html(value)
          }
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.handleLoadCore().then(() => {
      this.handleRegisterPlugin()
      this.handleInitEditor()
    })
  },
  beforeDestroy() {
    this.editor.remove('#' + this.dynamicId)
    this.editor = null
  },
  methods: {
    handleLoadCore() {
      return new Promise((resolve, reject) => {
        if (window.KindEditor) return resolve()
        const coreScript = document.createElement('script')
        coreScript.type = 'text/javascript'
        coreScript.src = `${publicPath}kindeditor/kindeditor-all-min.js`
        document.getElementsByTagName('head')[0].appendChild(coreScript)
        coreScript.onload = function() {
          if (window.KindEditor) {
            resolve()
          } else {
            console.error('加载kindeditor-all-min.js失败!\n', coreScript.src)
            reject()
          }
        }
      })
    },
    handleInitEditor() {
      const that = this
      // http://kindeditor.net/docs/option.html
      this.editor = window.KindEditor.create('#' + this.dynamicId, {
        width: '100%',
        height: `${this.height}px`,
        // 2或1或0，2时可以拖动改变宽度和高度，1时只能改变高度，0时不能拖动
        resizeType: 1,
        themeType: 'simple',
        // 美化HTML数据
        wellFormatMode: true,
        // 禁止自带的各种上传
        allowImageUpload: false,
        allowFlashUpload: false,
        allowMediaUpload: false,
        allowFileUpload: false,
        allowFileManager: false,
        items: [
          // 'undo', 'redo', 'fontname', '|',
          // 'quickformat', 'removeformat', 'paste', 'wordpaste', 'lineheight',
          // 'clearhtml', 'selectall', 'preview', 'print', 'template',
          // 'cut', 'copy', 'pagebreak', 'anchor', 'flash', 'multiimage', 'media',
          'source', '|',
          'formatblock', 'fontsize', 'forecolor', 'hilitecolor',
          'bold', 'italic', 'underline', 'strikethrough',
          'subscript', 'superscript', '|',
          'insertorderedlist', 'insertunorderedlist',
          'justifyleft', 'justifycenter', 'justifyright', 'justifyfull',
          'indent', 'outdent', '|',
          'plainpaste', 'table', 'hr', 'link', 'unlink', 'imageMe', 'baidumap', 'insertfile',
          'code', 'fullscreen',
        ],
        cssData: `img{max-width:100%;height:auto;}`,
        afterChange() {
          if (that.editor) {
            that.$emit('input', that.editor.html())
          }
        }
      })
    },
    handleRegisterPlugin() {
      const _this = this
      window.KindEditor.lang({
        imageMe: '图片',
      })
      window.KindEditor.plugin('imageMe', function(K) {
        const self = this
        self.clickToolbar('imageMe', function() {
          _this.$refs.fileRef.click()
        })
      })
    },
    async onFileChange(event) {
      try {
        const files = (event.srcElement || event.target).files
        if (!files.length) return
        const imgFile = files[0]
        if (imgFile.type.indexOf('image/') === -1) {
          return this.$modal.msgError('请上传如jpg/jpeg/png/gif等后缀的图片类型文件')
        }
        this.$modal.loading('上传中...')
        const formData = new FormData()
        formData.append('file', imgFile)
        formData.append('scene', 'blog')
        blog_upload_file(formData).then(res => {
          this.editor.insertHtml(`<p style="text-align:center;"><img src="${res.data}"/></p><p><br/></p>`)
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.$modal.closeLoading()
        this.$refs.fileRef.value = ''
      }
    }
  }
}
</script>

<style lang="scss">
.ke-icon-imageMe {
  width: 16px;
  height: 16px;
}
.ke-icon-imageMe {
  background-position: 0px -496px;
}
</style>
