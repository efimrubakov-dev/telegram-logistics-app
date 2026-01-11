// Скрипт для обновления версии в index.html
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const packageJsonPath = join(__dirname, '..', 'package.json');
  const indexHtmlPath = join(__dirname, '..', 'index.html');
  
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const version = packageJson.version || '1.0.0';

  // Читаем index.html
  let indexHtml = readFileSync(indexHtmlPath, 'utf-8');

  // Обновляем версию в meta теге (если существует)
  if (indexHtml.includes('meta name="version"')) {
    indexHtml = indexHtml.replace(
      /<meta name="version" content="[^"]*" \/>/,
      `<meta name="version" content="${version}" />`
    );
  } else {
    // Добавляем meta тег, если его нет
    indexHtml = indexHtml.replace(
      /<title>([^<]*)<\/title>/,
      `<title>$1</title>\n    <meta name="version" content="${version}" />`
    );
  }

  // Убираем query параметры из скрипта (Vite не поддерживает их в исходном файле)
  // Версионирование будет происходить через хеши в именах файлов при сборке
  indexHtml = indexHtml.replace(
    /src="\/src\/main\.tsx(\?v=[^"]*)?"/,
    `src="/src/main.tsx"`
  );

  // Записываем обратно
  writeFileSync(indexHtmlPath, indexHtml, 'utf-8');

  console.log(`✓ Версия обновлена до ${version}`);
} catch (error) {
  console.error('Ошибка при обновлении версии:', error.message);
  process.exit(1);
}
