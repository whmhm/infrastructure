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
      clientPort: undefined
    },
    watch: {
      usePolling: true,
      interval: 50,
      binaryInterval: 200,
      // 不忽略workspace内的packages变化，但忽略其他node_modules
      ignored: ['**/node_modules/(?!@infrastructure-monorepo)/**', '**/.git/**']
    },
    host: true,
    port: 5174,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
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