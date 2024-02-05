// @see: https://stylelint.io/user-guide/configure

/** @type {import('stylelint').Config} */
export default {
  root: true,
  // 继承某些已有的规则
  extends: [
    'stylelint-config-standard', // 配置 stylelint 拓展插件
    'stylelint-config-html/vue', // 配置 vue 中 template 样式格式化
    'stylelint-config-standard-scss', // 配置 stylelint scss 插件
    'stylelint-config-recommended-vue/scss', // 配置 vue 中 scss 样式格式化
    'stylelint-config-recess-order', // 配置 stylelint css 属性书写顺序插件,
  ],
  overrides: [
    // 扫描 .vue/html 文件中的 <style> 标签内的样式
    {
      files: ['**/*.{vue,html}'],
      customSyntax: 'postcss-html',
    },
  ],
  rules: {
    // URL 的引号 "always(必须加上引号)"|"never(没有引号)"
    'function-url-quotes': 'always',
    // 指定 16 进制颜色的简写或扩写 "short(16进制简写)"|"long(16进制扩写)"
    'color-hex-length': 'short',
    // 为颜色函数指定现代或传统的表示方法（"modern"|"legacy"）https://stylelint.io/user-guide/rules/color-function-notation/
    'color-function-notation': 'legacy',
    // 要求或禁止在规则之前的空行 "always(规则之前必须始终有一个空行)"|"never(规则前绝不能有空行)"|"always-multi-line(多行规则之前必须始终有一个空行)"|"never-multi-line(多行规则之前绝不能有空行)"
    'rule-empty-line-before': 'never',
    // 禁止在字体族名称列表中缺少通用字体族关键字
    'font-family-no-missing-generic-family-keyword': null,
    // 解决不能使用 @import 引入 scss 文件
    'scss/at-import-partial-extension': null,
    // 禁止未知的属性
    'property-no-unknown': null,
    // 禁止空源码
    'no-empty-source': null,
    // 强制选择器类名的格式
    'selector-class-pattern': null,
    // 关闭 vendor-prefix (为了解决多行省略 -webkit-box)
    'value-no-vendor-prefix': null,
    // 不允许较低特异性的选择器出现在覆盖较高特异性的选择器
    'no-descending-specificity': null,
    // 解决在 scss 中使用 v-bind 大写单词报错
    'value-keyword-case': null,
    // 禁止未知的伪类选择器
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'v-deep', 'deep', 'export'],
      },
    ],
    // 关掉`@import`位置检测
    'no-invalid-position-at-import-rule': null,
    // 设置动画名 不遵循kebab-case
    'keyframes-name-pattern': null,
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
}
