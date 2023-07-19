// 官方文档 https://pm2.keymetrics.io/docs/usage/application-declaration/
// 中文文档 https://pm2.fenxianglu.cn/docs/general/configuration-file
module.exports = {
  apps: [
    {
      name: 'efly-system-server',
      script: './app.js',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
      error_file: './logs/pm2_err.log',
      out_file: './logs/pm2_out.log',
    },
  ],
}
