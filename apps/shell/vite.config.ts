import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: 'apps/shell',
  envDir: '../../',
  publicDir: 'public',
  build: {
    outDir: '../../dist/apps/shell',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'apps/shell/src'),
      '@shared': path.resolve(process.cwd(), 'libs/shared/src')
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
