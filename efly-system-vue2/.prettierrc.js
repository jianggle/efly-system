// @see: https://prettier.io/docs/en/configuration.html
// @see: https://prettier.io/docs/en/options

module.exports = {
  // 指定最大换行长度
  printWidth: 120,
  // 指定缩进的空格数或制表符宽度
  tabWidth: 2,
  // 使用制表符而不是空格缩进 (true-制表符，false-空格)
  useTabs: false,
  // 语句末尾使用分号 (true-使用，false-不使用)
  semi: false,
  // 使用单引号而不是双引号 (true-单引号，false-双引号)
  singleQuote: true,
  // 在对象字面量中是否将属性名用引号括起来（可选值"<as-needed|consistent|preserve>"）
  quoteProps: 'as-needed',
  // 在JSX中使用单引号而不是双引号 (true-单引号，false-双引号)
  jsxSingleQuote: false,
  // 多行时尽可能添加尾随逗号（可选值"<none|es5|all>"）
  trailingComma: 'es5',
  // 在对象，数组括号与文字之间加空格（true-有空格"{ foo: bar }"，false-无需空格"{foo: bar}"）
  bracketSpacing: true,
  // 将“ > ”多行元素放在最后一行的末尾，而不是单独放在下一行 (true：放末尾，false：单独一行)
  bracketSameLine: false,
  // (x) => {} 箭头函数参数只有一个时是否要需要小括号 (avoid：省略括号，always：不省略括号)
  arrowParens: 'always',
  // 用于控制文本是否应该被换行以及如何进行换行（可选值"<always|never|preserve>"）
  proseWrap: 'preserve',
  // 在html中空格是否敏感（"css"-遵守CSS display属性的默认值，"strict"-空格被认为是敏感的，"ignore"-空格被认为是不敏感的）
  htmlWhitespaceSensitivity: 'css',
  // 控制在Vue单文件组件中<script>和<style>标签内的代码是否缩进
  vueIndentScriptAndStyle: false,
  // 文件末尾换行符（可选值"<lf|crlf|cr|auto>"）
  endOfLine: 'lf',
}
