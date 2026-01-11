import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

// Читаем версию из package.json
const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
const version = packageJson.version || '1.0.0'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/telegram-logistics-app/',
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  build: {
    rollupOptions: {
      output: {
        // Добавляем версию к именам файлов для cache busting
        entryFileNames: `assets/[name]-${version}-[hash].js`,
        chunkFileNames: `assets/[name]-${version}-[hash].js`,
        assetFileNames: `assets/[name]-${version}-[hash].[ext]`,
      },
    },
  },
})
