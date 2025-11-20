import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  base: '/',
  envDir: path.join(__dirname, '../../'),
  publicDir: path.join(__dirname, 'public'),
  build: {
    outDir: path.join(__dirname, '../../dist/apps/shell'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.join(__dirname, 'index.html')
    }
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@shared': path.join(__dirname, '../../libs/shared/src')
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
