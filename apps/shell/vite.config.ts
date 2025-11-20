import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  envDir: path.resolve(__dirname, '../../'),
  build: {
    outDir: '../../dist/apps/shell',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../../libs/shared/src')
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
