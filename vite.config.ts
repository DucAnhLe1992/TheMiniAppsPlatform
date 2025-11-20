import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  base: '/',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@shared': path.join(__dirname, 'libs/shared/src')
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
