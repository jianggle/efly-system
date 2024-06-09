const path = require('path')
const os = require('os')
const HappyPack = require('happypack')
const { defineConfig } = require('@vue/cli-service')
const CompressionPlugin = require('compression-webpack-plugin')
const { isDev, isProd, siteName, useCdn, useDll, useHappyPack, useGzip } = require('./src/config')
const { cdnResource } = require('./src/config/cdnUrls')
const { DllReferencePlugin } = require('webpack')
const HtmlTagsPlugin = require('html-webpack-tags-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// https://cli.vuejs.org/zh/config/
module.exports = defineConfig({
  productionSourceMap: false,
  publicPath: process.env.VUE_APP_BASE_URL,
  outputDir: 'dist',
  assetsDir: 'assets',
  lintOnSave: isDev,

  devServer: {
    host: '0.0.0.0',
    port: 9999,
    proxy: {
      '/dev-api': {
        target: 'http://localhost:9998',
        changeOrigin: true,
        pathRewrite: {
          '^/dev-api/': '',
        },
      },
      '/prod-api': {
        target: 'https://api.example.com',
        changeOrigin: true,
        pathRewrite: {
          '^/prod-api/': '',
        },
      },
    },
  },

  configureWebpack(config) {
    config.name = siteName
    if (useHappyPack) {
      const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
      config.plugins.push(
        new HappyPack({
          id: 'happybabel',
          loaders: ['babel-loader'],
          threadPool: happyThreadPool,
        })
      )
    }
    if (isProd) {
      if (useCdn) {
        config.externals = cdnResource.externals
      } else {
        if (useDll) {
          config.plugins.push(
            new DllReferencePlugin({
              manifest: resolve('public/static/dll/vendor-manifest.json'),
            }),
            new HtmlTagsPlugin({
              append: false,
              publicPath: process.env.VUE_APP_BASE_URL,
              tags: ['static/dll/vendor.dll.js'],
            })
          )
        }
      }
    }
  },

  chainWebpack(config) {
    // 移除预加载插件
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    config.plugin('html').tap((args) => {
      // 挂载cdn资源
      if (isProd && useCdn) {
        args[0].cdn = cdnResource
      }
      return args
    })

    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()

    config.when(isProd, (config) => {
      // 配置gzip
      if (useGzip) {
        config.plugin('compressionPlugin').use(
          new CompressionPlugin({
            test: /\.js$|\.html$|\.css/,
            // 超过100k才进行处理
            threshold: 1024 * 100,
          })
        )
      }

      // 如果使用了cdn或者dll，则不做下述操作
      if (useCdn || useDll) return
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            // only package third parties that are initially dependent
            chunks: 'initial',
          },
          elementUI: {
            // split elementUI into a single package
            name: 'chunk-elementUI',
            // the weight needs to be larger than libs and app or it will be packaged into libs or app
            priority: 20,
            // in order to adapt to cnpm
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
          commons: {
            name: 'chunk-commons',
            // can customize your rules
            test: resolve('src/components'),
            // minimum common number
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    })
  },
})
