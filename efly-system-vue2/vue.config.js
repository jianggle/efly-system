const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const { isDev, isProd, siteName, useCdn, useGzip } = require('./src/config')
const { cdnResource } = require('./src/config/cdnUrls')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// https://cli.vuejs.org/zh/config/
module.exports = {
  productionSourceMap: false,
  outputDir: 'dist',
  assetsDir: 'assets',

  devServer: {
    host: '0.0.0.0',
    port: 9999,
    proxy: {
      '/manage-api': {
        target: 'http://localhost:9998',
      }
    }
  },

  configureWebpack(config) {
    config.name = siteName
    if (isProd && useCdn) {
      config.externals = cdnResource.externals
    }
  },

  chainWebpack(config) {
    // 移除预加载插件
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    config.plugin('html').tap(args => {
      // 挂载cdn资源
      if (isProd && useCdn) {
        args[0].cdn = cdnResource
      }
      return args
    })

    // set svg-sprite-loader
    config.module.rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module.rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.when(isProd, config => {
      // 配置gzip
      if (useGzip) {
        config.plugin('compressionPlugin')
        .use(new CompressionPlugin({
          test: /\.js$|\.html$|\.css/,
          // 超过100k才进行处理
          threshold: 1024 * 100,
        }))
      }

      // 如果使用了cdn，则不做下述操作
      if (useCdn) return
      config.plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [{
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        }])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            // only package third parties that are initially dependent
            chunks: 'initial'
          },
          elementUI: {
            // split elementUI into a single package
            name: 'chunk-elementUI',
            // the weight needs to be larger than libs and app or it will be packaged into libs or app
            priority: 20,
            // in order to adapt to cnpm
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/
          },
          commons: {
            name: 'chunk-commons',
            // can customize your rules
            test: resolve('src/components'),
            // minimum common number
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  }
}
