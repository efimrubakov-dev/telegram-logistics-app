import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Получаем путь к package.json
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Читаем версию из package.json
let version = '1.0.0'
try {
  const packageJsonPath = join(__dirname, 'package.json')
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
  version = packageJson.version || '1.0.0'
} catch (error) {
  console.warn('Не удалось прочитать версию из package.json, используется версия по умолчанию')
}

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
        // Vite автоматически добавит хеш, что обеспечит обновление кэша
        entryFileNames: `assets/[name]-v${version}-[hash].js`,
        chunkFileNames: `assets/[name]-v${version}-[hash].js`,
        assetFileNames: `assets/[name]-v${version}-[hash].[ext]`,
      },
    },
  },
})
