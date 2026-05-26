import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({

  plugins: [
    vue({
      // 替代 chainWebpack 中的 isCustomElement 配置
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'css-doodle'
        }
      }
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@components':'/src/components',

    },
    
  },
  // 开发服务器配置（替代 devServer）
  server: {
    port: 8080, // 默认端口，可修改
    host: '0.0.0.0',  // 或设置为 true，监听所有地址
    proxy: {
      '/api': {
        // target: 'http://192.168.2.103:5000', // 家里环境
        // target: 'http://172.17.57.178:5000', // aliyun
        // target: 'http://192.168.1.5:5000', // 公司-wifi
        target: 'http://192.168.100.38:5000', // 公司-100网线

        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 替代 pathRewrite
      }
    },
    
    // 替代 client.overlay 配置（关闭错误遮罩）
    hmr: {
      overlay: false
    }
  },
  // 构建配置
  build: {
    outDir: 'dist',
    sourcemap: true
  },
})
