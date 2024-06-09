const path = require('path')
const { DllPlugin } = require('webpack')
const { cdnResource } = require('./src/config/cdnUrls')

module.exports = {
  entry: {
    vendor: Object.keys(cdnResource.externals),
  },
  mode: 'production',
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'all',
          name: 'vendor',
          test: /node_modules/,
        },
      },
    },
  },
  output: {
    filename: '[name].dll.js', // 输出路径和文件名称
    library: '[name]', // 全局变量名称：其他模块会从此变量上获取里面模块
    path: path.join(__dirname, 'public/static/dll'), // 输出目录路径
  },
  plugins: [
    new DllPlugin({
      name: '[name]', // 全局变量名称：减小搜索范围，与output.library结合使用
      path: path.join(__dirname, 'public/static/dll/[name]-manifest.json'), // 输出目录路径
    }),
  ],
}
