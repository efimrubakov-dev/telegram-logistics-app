# Настройка базы данных

## Быстрый старт

### 1. Установка зависимостей backend

```bash
cd server
npm install
```

### 2. Запуск backend сервера

```bash
# Разработка (с автоперезагрузкой)
npm run dev

# Продакшн
npm start
```

Сервер запустится на `http://localhost:3000`

### 3. Настройка frontend

Создайте файл `.env` в корне проекта:

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Проверка работы

Откройте приложение в Telegram. Оно автоматически определит доступность API и будет использовать его вместо localStorage.

## Структура базы данных

База данных SQLite создается автоматически в файле `server/database.sqlite`.

### Таблицы:

- **users** - Пользователи Telegram
- **recipients** - Получатели
- **orders** - Заказы/товары
- **consolidations** - Объединения заказов
- **delivery_addresses** - Адреса доставки
- **parcels** - Посылки

## Деплой backend

### Вариант 1: VPS/сервер

1. Загрузите код на сервер
2. Установите зависимости: `npm install`
3. Запустите через PM2: `pm2 start server.js`
4. Настройте nginx для проксирования запросов

### Вариант 2: Railway/Render

1. Подключите репозиторий
2. Укажите команду запуска: `npm start`
3. Установите переменную окружения `PORT`
4. Получите URL и укажите его в `.env` frontend

### Вариант 3: Docker

Создайте `Dockerfile`:

```dockerfile
FROM node:18
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ .
EXPOSE 3000
CMD ["node", "server.js"]
```

## Миграция данных из localStorage

Если у вас уже есть данные в localStorage, можно создать скрипт миграции для переноса данных в базу.

## Безопасность

⚠️ **Важно**: В продакшене необходимо:
1. Добавить проверку подписи Telegram WebApp
2. Использовать HTTPS
3. Настроить CORS правильно
4. Добавить rate limiting
5. Использовать переменные окружения для секретов
