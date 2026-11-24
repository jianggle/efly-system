<template>
  <div
    class="kind-editor-wrapper"
    v-loading="isUploadding"
    element-loading-background="rgba(255, 255, 255, 0.5)"
    element-loading-text="上传中..."
  >
    <textarea :id="dynamicId" style="visibility: hidden" />
    <input
      ref="imgRef"
      type="file"
      accept="image/jpg,image/jpeg,image/png,image/gif"
      style="display: none"
      @change="onImgChange"
    />
  </div>
</template>

<script lang="ts">
// 模块级状态：同页多实例共享（`<script setup>`顶层代码每个实例都会重新执行）

/** 核心脚本加载Promise，避免多个实例重复注入脚本 */
let coreLoadPromise: Promise<void> | null = null

/** 插件是否已注册（KindEditor插件是全局注册的） */
let pluginRegistered = false

/** 编辑器实例 → 打开其所属组件的文件选择框，解决同页多实例时customImg按钮串扰 */
const editorFilePickers = new WeakMap<KindEditorInstance, () => void>()
</script>

<script setup lang="ts" name="KindEditor">
import { useFormDisabled, ElMessage } from 'element-plus'
import AppConfig from '@/config'
import { cms_upload } from '@/api/cms'

const formDisabled = useFormDisabled()

const props = withDefaults(
  defineProps<{
    /** v-model绑定的HTML内容 */
    modelValue?: string
    /** 编辑器高度（单位px） */
    height?: number
    /**是否禁用 */
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    height: 480,
    disabled: undefined,
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

/** 当前实例唯一ID */
const dynamicId = `kindeditor-${getCurrentInstance()?.uid ?? Date.now()}`

/** 文件选择框元素 */
const imgRef = ref<HTMLInputElement | null>(null)

/** 编辑器实例 / Editor instance */
const editorRef = ref<KindEditorInstance>()

/** 是否已卸载（防止核心脚本加载完成前组件已销毁仍继续初始化） */
let disposed = false

// 外部值变化时同步进编辑器
watch(
  () => props.modelValue,
  (val) => {
    const editor = editorRef.value
    if (editor && val !== editor.html()) {
      editor.html(val)
    }
  },
  { immediate: true }
)

// 禁用状态实时切换（immediate触发时编辑器尚未创建，由初始化时兜底）
watch(
  () => formDisabled.value,
  (val) => {
    editorRef.value?.readonly(val)
  },
  { immediate: true }
)

onMounted(() => {
  handleLoadCore().then(() => {
    if (disposed) return
    handleRegisterPlugin()
    handleInitEditor()
  })
})

onBeforeUnmount(() => {
  disposed = true
  const editor = editorRef.value
  if (!editor) return
  editorFilePickers.delete(editor)
  editor.remove(`#${dynamicId}`)
  editorRef.value = undefined
})

/** 加载kindeditor核心脚本 */
function handleLoadCore(): Promise<void> {
  if (window.KindEditor) return Promise.resolve()
  coreLoadPromise ??= new Promise((resolve, reject) => {
    const coreScript = document.createElement('script')
    coreScript.type = 'text/javascript'
    coreScript.src = `${AppConfig.editorPath}kindeditor-all-min.js`
    coreScript.onload = () => {
      if (window.KindEditor) {
        resolve()
      } else {
        console.error('加载kindeditor-all-min.js失败!\n', coreScript.src)
        coreLoadPromise = null
        reject(new Error(coreScript.src))
      }
    }
    coreScript.onerror = () => {
      coreLoadPromise = null
      reject(new Error(coreScript.src))
    }
    document.getElementsByTagName('head')[0].appendChild(coreScript)
  })
  return coreLoadPromise
}

/** 注册customImg插件（全局仅注册一次） */
function handleRegisterPlugin() {
  if (pluginRegistered) return
  pluginRegistered = true
  window.KindEditor.lang({
    customImg: '图片',
  })
  window.KindEditor.plugin('customImg', function (this: KindEditorInstance) {
    // 插件函数会在每个编辑器创建时以该编辑器实例为this被调用，
    // 据此把按钮点击路由到该实例所属组件的文件选择框（修复多实例串扰）
    this.clickToolbar('customImg', () => {
      editorFilePickers.get(this)?.()
    })
  })
}

/** 初始化编辑器 */
// http://kindeditor.net/docs/option.html
function handleInitEditor() {
  const editor = window.KindEditor.create(`#${dynamicId}`, {
    width: '100%',
    height: `${props.height}px`,
    // 2或1或0，2时可以拖动改变宽度和高度，1时只能改变高度，0时不能拖动
    resizeType: 1,
    themeType: 'simple',
    // 美化HTML数据
    wellFormatMode: false,
    // 禁止自带的各种上传
    allowImageUpload: false,
    allowFlashUpload: false,
    allowMediaUpload: false,
    allowFileUpload: false,
    allowFileManager: false,
    useContextmenu: !formDisabled.value,
    items: [
      // 'undo', 'redo', 'fontname', '|',
      // 'quickformat', 'removeformat', 'paste', 'wordpaste', 'lineheight',
      // 'clearhtml', 'selectall', 'preview', 'print', 'template',
      // 'cut', 'copy', 'pagebreak', 'anchor', 'flash', 'multiimage', 'media',
      'source',
      '|',
      'formatblock',
      'fontsize',
      'forecolor',
      'hilitecolor',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'subscript',
      'superscript',
      '|',
      'insertorderedlist',
      'insertunorderedlist',
      'justifyleft',
      'justifycenter',
      'justifyright',
      'justifyfull',
      'indent',
      'outdent',
      '|',
      'plainpaste',
      'table',
      'hr',
      'link',
      'unlink',
      'customImg',
      // 'baidumap',
      'insertfile',
      'code',
      'fullscreen',
    ],
    cssData: `img{max-width:100%;height:auto;}`,
    afterChange: () => {
      const ed = editorRef.value
      if (ed) emit('update:modelValue', ed.html())
    },
  })
  editorRef.value = editor
  // 应用初始禁用状态（immediate的watch触发时编辑器尚不存在）
  if (formDisabled.value) {
    editor.readonly()
  }
  // customImg按钮点击时打开当前组件的文件选择框（禁用时不响应）
  editorFilePickers.set(editor, () => {
    if (formDisabled.value) return
    imgRef.value?.click()
  })

  // 创建完成后补注入当前值：watch只能覆盖编辑器创建之后的变化，
  // 脚本加载期间外部设置的modelValue会丢失，在此统一补上
  if (props.modelValue && props.modelValue !== editor.html()) {
    editor.html(props.modelValue)
  }
}

const isUploadding = ref(false)
const onImgChange = async (event: Event) => {
  try {
    const files = (event.target as HTMLInputElement).files
    if (!files || !files.length) return
    const imgFile = files[0]
    if (imgFile.type.indexOf('image/') === -1) {
      return ElMessage.error('请上传合法的图片类型文件')
    }
    isUploadding.value = true
    const formData = new FormData()
    formData.append('file', imgFile)
    formData.append('scene', 'blog')
    const res = await cms_upload(formData)
    if (typeof res.data !== 'string' || !res.data) {
      ElMessage.error('接口未返回正确的文件路径')
    } else {
      editorRef.value?.insertHtml(`<p style="text-align:center;"><img src="${res.data}" alt="${imgFile.name}"/></p><p><br/></p>`)
    }
  } catch (error) {
    console.log(error)
  } finally {
    isUploadding.value = false
    if (imgRef.value) {
      imgRef.value.value = ''
    }
  }
}
</script>

<style lang="scss">
.kind-editor-wrapper {
  display: inline-block;
  width: 100%;
  .ke-container {
    box-sizing: border-box;
  }
  .ke-icon-customImg {
    width: 16px;
    height: 16px;
    background-position: 0 -496px;
  }
}
</style>
