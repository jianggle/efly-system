import path from 'path'
import vue from '@vitejs/plugin-vue'
import { createHtmlPlugin } from 'vite-plugin-html'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'
import autoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import compression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default function createVitePlugins(
  viteEnv: Record<string, string>,
  isBuild = false
) {
  const plugins = [
    vue(),
    createHtmlPlugin({
      inject: {
        data: {
          title: viteEnv.VITE_APP_TITLE,
        },
      },
    }),
    // 使用setup语法糖时直接在script标签上定义组件name
    vueSetupExtend(),
    // 自动引入常用api
    autoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: './src/types/auto-imports.d.ts',
    }),
    // 生成svg雪碧图
    // https://github.com/vbenjs/vite-plugin-svg-icons/blob/main/README.zh_CN.md
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
      symbolId: 'icon-[dir]-[name]',
      svgoOptions: isBuild,
    }),
  ]

  if (isBuild && !!viteEnv.VITE_APP_BUILD_COMPRESS) {
    const compressList = viteEnv.VITE_APP_BUILD_COMPRESS.split(',')
    if (compressList.includes('gzip')) {
      plugins.push(
        compression({
          ext: '.gz',
          deleteOriginFile: false,
          // 超过100k才进行处理
          threshold: 1024 * 100,
        })
      )
    }
    if (compressList.includes('brotli')) {
      plugins.push(
        compression({
          ext: '.br',
          algorithm: 'brotliCompress',
          deleteOriginFile: false,
          // 超过100k才进行处理
          threshold: 1024 * 100,
        })
      )
    }
  }

  if (isBuild && viteEnv.VITE_APP_REPORT) {
    plugins.push(
      visualizer({
        emitFile: false,
        filename: 'report.html',
      })
    )
  }

  return plugins
}
