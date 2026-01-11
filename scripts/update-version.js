// Скрипт для обновления версии в index.html
import { readFileSync, writeFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
const version = packageJson.version || '1.0.0';

// Читаем index.html
let indexHtml = readFileSync('./index.html', 'utf-8');

// Обновляем версию в meta теге
indexHtml = indexHtml.replace(
  /<meta name="version" content="[^"]*" \/>/,
  `<meta name="version" content="${version}" />`
);

// Обновляем версию в скрипте
indexHtml = indexHtml.replace(
  /src="\/src\/main\.tsx\?v=[^"]*"/,
  `src="/src/main.tsx?v=${version}"`
);

// Записываем обратно
writeFileSync('./index.html', indexHtml, 'utf-8');

console.log(`Версия обновлена до ${version}`);
