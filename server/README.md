# Backend API для Telegram Logistics App

## Установка

```bash
cd server
npm install
```

## Запуск

### Разработка
```bash
npm run dev
```

### Продакшн
```bash
npm start
```

## API Endpoints

### Users
- `GET /api/users/me` - Получить текущего пользователя

### Recipients (Получатели)
- `GET /api/recipients` - Список получателей
- `GET /api/recipients/:id` - Получить получателя
- `POST /api/recipients` - Создать получателя
- `PUT /api/recipients/:id` - Обновить получателя
- `DELETE /api/recipients/:id` - Удалить получателя

### Orders (Заказы)
- `GET /api/orders` - Список заказов
- `GET /api/orders/:id` - Получить заказ
- `POST /api/orders` - Создать заказ
- `PUT /api/orders/:id` - Обновить заказ
- `DELETE /api/orders/:id` - Удалить заказ
- `DELETE /api/orders` - Удалить несколько заказов (body: { ids: [...] })

### Delivery Addresses (Адреса доставки)
- `GET /api/delivery-addresses` - Список адресов
- `POST /api/delivery-addresses` - Создать адрес
- `PUT /api/delivery-addresses/:id` - Обновить адрес
- `DELETE /api/delivery-addresses/:id` - Удалить адрес

### Consolidations (Объединения)
- `GET /api/consolidations` - Список объединений
- `POST /api/consolidations` - Создать объединение
- `PUT /api/consolidations/:id` - Обновить объединение
- `DELETE /api/consolidations/:id` - Удалить объединение

## Аутентификация

В заголовках запросов передавайте:
- `x-telegram-id` - ID пользователя в Telegram
- `x-telegram-username` - Username пользователя
- `x-telegram-first-name` - Имя пользователя
- `x-telegram-last-name` - Фамилия пользователя

Или в теле запроса:
- `telegram_id`
- `username`
- `first_name`
- `last_name`

## База данных

Используется SQLite. Файл базы данных создается автоматически при первом запуске: `database.sqlite`
