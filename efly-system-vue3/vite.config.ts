import { defineConfig, ConfigEnv, loadEnv } from 'vite'
import createVitePlugins from './vite/plugins'

export default defineConfig(({ command, mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: createVitePlugins(env, command === 'build'),
    base: env.VITE_APP_BASE_URL,
    resolve: {
      alias: [
        {
          find: '@',
          replacement: '/src',
        },
      ],
    },
    server: {
      host: '0.0.0.0',
      port: 9997,
      proxy: {
        '/dev-api': {
          target: 'http://localhost:9998',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/dev-api/, ''),
        },
        '/prod-api': {
          target: 'https://api.example.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/prod-api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // https://cn.vitejs.dev/config/build-options.html#build-minify
      minify: 'terser',
      // https://terser.org/docs/api-reference#minify-options
      terserOptions: {
        compress: {
          // 让全部console失效(drop_console默认false)
          // drop_console: true,
          // 让指定方法失效
          pure_funcs: ['console.log', 'console.info'],
        },
      },
      // 启用/禁用 gzip 压缩大小报告
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          // 按分类输出到各自目录
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          // 分包处理
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const chunkName = id.match(/(?<=\/node_modules\/).*?(?=\/)/g)[0]
              if (chunkName === 'element-plus') return 'element-plus'
              return 'vendor'
            }
            if (id.includes('src/icons/svg/')) {
              return 'svgicons'
            }
          },
        },
      },
    },
  }
})
