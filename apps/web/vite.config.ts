import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx|tsx|js|ts)$/,
      // 包含workspace内的packages，只排除其他node_modules
      exclude: 'node_modules/(?!@infrastructure-monorepo)/**'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    hmr: {
      overlay: true,
      // HMR默认启用，不需要显式设置enabled属性
    },
    watch: {
      usePolling: true,
      interval: 50,
      binaryInterval: 200,
      // 优化忽略配置，确保workspace内的packages变化能被正确监视
      // WatchOptions类型不支持include属性，只需配置ignored
      // ignored: ['**/node_modules/(?!@infrastructure-monorepo)/**', '**/.git/**']
    },
    host: true,
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    } 
  },  
  build: {
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})