# efly-system-vue2

## 开发

```bash
# 克隆项目
git clone https://gitee.com/jianggle/efly-system.git

# 进入项目目录
cd efly-system-vue2

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm start 或 npm run dev

# eslint规则检查
npm run lint

# eslint规则自动修复
npm run lint:fix
```

浏览器访问 http://localhost:9999/

## 发布

```bash
npm run build
```
