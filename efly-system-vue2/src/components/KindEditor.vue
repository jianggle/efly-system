<template>
  <textarea
    :id="dynamicId"
    v-model="value"
    style="visibility:hidden;"
  />
</template>

<script>
import { publicPath } from '@/config'
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
        allowImageUpload: true,
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
          'plainpaste', 'table', 'hr', 'link', 'unlink', 'image', 'baidumap', 'insertfile',
          'code', 'fullscreen',
        ],
        afterChange() {
          if (that.editor) {
            that.$emit('input', that.editor.html())
          }
        }
      })
    }
  }
}
</script>
