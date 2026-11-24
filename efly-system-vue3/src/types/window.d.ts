export {}

declare global {
  /** KindEditor 编辑器实例（http://kindeditor.net/docs/api.html） */
  interface KindEditorInstance {
    /** 获取/设置编辑器HTML内容 */
    html(val?: string): string
    /** 获取纯文本内容 */
    text(val?: string): string
    /** 插入HTML内容到当前光标处 */
    insertHtml(val: string): KindEditorInstance
    /** 在编辑器末尾追加HTML内容 */
    appendHtml(val: string): KindEditorInstance
    /** 设置/取消只读状态 */
    readonly(val?: boolean): KindEditorInstance
    /** 编辑器是否处于只读状态 */
    isReadonly(): boolean
    /** 聚焦编辑器 */
    focus(): KindEditorInstance
    /** 移除焦点 */
    blur(): KindEditorInstance
    /** 内容是否为空 */
    isEmpty(): boolean
    /** 同步编辑器内容到原始textarea（用于表单提交前） */
    sync(): KindEditorInstance
    /** 绑定工具栏按钮点击回调 */
    clickToolbar(name: string, fn: () => void): KindEditorInstance
    /** 移除编辑器，恢复原始textarea（参数为创建时的选择器） */
    remove(selector?: string): void
    /** 编辑器容器DOM */
    container: HTMLElement
    /** 编辑器内部iframe的body */
    edit: { doc: Document; body: HTMLElement; win: Window }
  }

  /** KindEditor 全局对象（静态方法） */
  interface KindEditorStatic {
    /** 创建编辑器实例 */
    create(selector: string, options?: Record<string, unknown>): KindEditorInstance
    /** 注册语言包 */
    lang(options: Record<string, string>): KindEditorStatic
    /** 注册插件，插件函数在每个编辑器创建时以其实例为this被调用 */
    plugin(name: string, fn: (this: KindEditorInstance, ...args: unknown[]) => void): KindEditorStatic
  }

  interface Window {
    KindEditor: KindEditorStatic
  }
}
