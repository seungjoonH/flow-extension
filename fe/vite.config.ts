import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const feDir = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, feDir, '')
  const apiProxy = env.VITE_API_PROXY;

  return {
    plugins: [react()],
    cacheDir: path.resolve(feDir, '../node_modules/.vite-fe'),
    resolve: { alias: { '@': path.resolve(feDir, 'src') } },
    server: { proxy: { '/api': { target: apiProxy, changeOrigin: true } } },
  }
})
