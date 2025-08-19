# efly-system-vue3

## 技术选型

基于Vue3.5、TypeScript、Vite5、Pinia、Element-Plus等最新技术栈。

## 开发工具

本项目使用`Visual Studio Code`进行开发，项目已内置其相关配置，包含推荐的插件和设置等。建议使用[Visual Studio Code最新版本](https://code.visualstudio.com/#alt-downloads)。

安装并启用以下插件，获得最佳开发体验：

- [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) ==> Vue3 官方插件
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) ==> 代码检查
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) ==> CSS 代码检查 && 格式化
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) ==> 代码格式化
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) ==> 统一不同编辑器的编码风格
- [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag) ==> 自动添加HTML/XML闭合标签
- [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag) ==> 自动重命名成对的HTML/XML标签
- [GitLens — Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) ==> 增强Git，轻松查看每行代码的提交记录
- [Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-ceintl.vscode-language-pack-zh-hans) ==> 适用于 VS Code 的中文（简体）语言包

## 开发环境

由于基于`Vite5`开发，故node版本需要`^18.0.0 或 >=20.0.0`

ps：可以使用`nvm`管理node版本

## 开发命令

使用固定的依赖项版本号来做版本锁定，所以`npm/pnpm/yarn`等均可使用（不必再提交磨人的`package-lock.json` / `pnpm-lock.yaml` / `yarn.lock`等版本锁定文件）。

- **安装：**

```bash
npm install 或 pnpm install 等
# 建议使用淘宝镜像以提升包下载速度
npm install --registry=https://registry.npmmirror.com
```

- **运行：**

```bash
npm run dev 或 npm run serve
```

- **构建：**

```bash
npm run build
```

- **预览：**

```bash
npm run preview
```

- **校验：**

```bash
# vue-tsc ts类型检测
npm run type:check

# eslint 检测代码
npm run lint:eslint

# prettier 格式化代码
npm run lint:prettier

# stylelint 格式化样式
npm run lint:stylelint
```

## 浏览器支持

- 本地开发推荐使用 Chrome 最新版浏览器 [Download](https://www.google.com/intl/zh-CN/chrome/)。
- 生产环境支持现代浏览器，不再支持 IE 浏览器，更多浏览器可以查看 [Can I Use Es Module](https://caniuse.com/?search=ESModule)。
