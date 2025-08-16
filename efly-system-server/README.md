# efly-system-server

一个基于koajs+mysql的服务端。

## 使用说明

* 存储空间使用七牛云，需自行注册

## 命令与部署

```bash
# 安装依赖
$ npm install

# 开发模式
$ npm run dev

# 预览模式
$ npm run start

# pm2部署
pm2 start pm2.config.cjs --env production
pm2 restart pm2.config.cjs --env development

# 启用端口
9998 `在.env文件中配置`
```

## 前端代码部署

将前端打包好的资源文件放到`public/admin-vue2`或`public/admin-vue3`文件夹下，然后重启服务即可
