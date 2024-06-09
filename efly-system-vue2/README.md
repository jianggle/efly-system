# efly-system-vue2

## 技术选型

基于Vue2、Vue CLI、Vuex3、Vue Router3、Element-UI等技术栈。

## 开发工具

本项目使用`Visual Studio Code`进行开发，项目已内置其相关配置，包含推荐的插件和设置等。建议使用[Visual Studio Code最新版本](https://code.visualstudio.com/#alt-downloads)。

安装并启用以下插件，获得最佳开发体验：

- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) ==> Vetur
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) ==> 代码检查
- [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint) ==> CSS 代码检查 && 格式化
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) ==> 代码格式化
- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig) ==> 统一不同编辑器的编码风格
- [DotENV](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv) ==> 高亮 .env 文件

## 开发环境

node版本需要 `>=14.15.0`

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
# 如果`config.useCdn=false`且`config.useDll=true`,需先执行`npm run build:dll`
# 构建部署包
npm run build
# 构建部署包并生成包分析文件`dist/report.html`
npm run build:report
```

- **校验：**

```bash
# eslint/prettier 规则检查
npm run lint:nofix

# eslint/prettier 修复/格式化
npm run lint

# stylelint 格式化样式
npm run lint:stylelint
```
