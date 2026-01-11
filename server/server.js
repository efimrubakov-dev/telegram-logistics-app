import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*', // В продакшене укажите конкретные домены
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Инициализация базы данных
const dbPath = join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Промис-обертки для sqlite3
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));
const dbExec = promisify(db.exec.bind(db));

// Создание таблиц
(async () => {
  await dbExec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    telegram_id TEXT UNIQUE NOT NULL,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS recipients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    middle_name TEXT,
    email TEXT,
    phone TEXT,
    birth_date TEXT,
    passport_series TEXT,
    passport_number TEXT,
    passport_issue_date TEXT,
    inn TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    link TEXT,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    photo TEXT,
    warehouse_photo TEXT,
    comment TEXT,
    check_service TEXT,
    consolidation INTEGER DEFAULT 1,
    remove_postal_packaging INTEGER DEFAULT 0,
    remove_original_packaging INTEGER DEFAULT 0,
    photo_report INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Ожидается на складе',
    status_date TEXT,
    track_number TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS consolidations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    order_ids TEXT,
    recipient_id INTEGER,
    delivery_address_id INTEGER,
    status TEXT DEFAULT 'Создано',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES recipients(id)
  );

  CREATE TABLE IF NOT EXISTS delivery_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    company TEXT,
    address TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS parcels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    consolidation_id INTEGER,
    track_number TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (consolidation_id) REFERENCES consolidations(id)
  );
  `);
})();

// Вспомогательная функция для получения или создания пользователя
async function getOrCreateUser(telegramId, username, firstName, lastName) {
  let user = await dbGet('SELECT * FROM users WHERE telegram_id = ?', [telegramId]);
  
  if (!user) {
    const result = await dbRun(
      'INSERT INTO users (telegram_id, username, first_name, last_name) VALUES (?, ?, ?, ?)',
      [telegramId, username || null, firstName || null, lastName || null]
    );
    user = await dbGet('SELECT * FROM users WHERE id = ?', [result.lastID]);
  } else {
    // Обновляем данные пользователя
    await dbRun(
      'UPDATE users SET username = ?, first_name = ?, last_name = ? WHERE telegram_id = ?',
      [username || null, firstName || null, lastName || null, telegramId]
    );
    user = await dbGet('SELECT * FROM users WHERE telegram_id = ?', [telegramId]);
  }
  
  return user;
}

// Middleware для получения пользователя из Telegram данных
async function getUserFromRequest(req, res, next) {
  try {
    // В реальном приложении здесь должна быть проверка подписи Telegram
    const telegramId = req.headers['x-telegram-id'] || req.body.telegram_id || '1';
    const username = req.headers['x-telegram-username'] || req.body.username;
    const firstName = req.headers['x-telegram-first-name'] || req.body.first_name;
    const lastName = req.headers['x-telegram-last-name'] || req.body.last_name;
    
    const user = await getOrCreateUser(telegramId, username, firstName, lastName);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

// ==================== USERS ====================
app.get('/api/users/me', getUserFromRequest, (req, res) => {
  res.json(req.user);
});

// ==================== RECIPIENTS ====================
app.get('/api/recipients', getUserFromRequest, async (req, res) => {
  try {
    const recipients = await dbAll('SELECT * FROM recipients WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(recipients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/recipients/:id', getUserFromRequest, (req, res) => {
  const recipient = db.prepare('SELECT * FROM recipients WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!recipient) {
    return res.status(404).json({ error: 'Получатель не найден' });
  }
  res.json(recipient);
});

app.post('/api/recipients', getUserFromRequest, (req, res) => {
  const {
    name, first_name, last_name, middle_name, email, phone,
    birth_date, passport_series, passport_number, passport_issue_date, inn
  } = req.body;
  
  const insert = db.prepare(`
    INSERT INTO recipients (
      user_id, name, first_name, last_name, middle_name, email, phone,
      birth_date, passport_series, passport_number, passport_issue_date, inn
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = insert.run(
    req.user.id, name, first_name, last_name, middle_name, email, phone,
    birth_date, passport_series, passport_number, passport_issue_date, inn
  );
  
  const recipient = db.prepare('SELECT * FROM recipients WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(recipient);
});

app.put('/api/recipients/:id', getUserFromRequest, (req, res) => {
  const {
    name, first_name, last_name, middle_name, email, phone,
    birth_date, passport_series, passport_number, passport_issue_date, inn
  } = req.body;
  
  const update = db.prepare(`
    UPDATE recipients SET
      name = ?, first_name = ?, last_name = ?, middle_name = ?, email = ?, phone = ?,
      birth_date = ?, passport_series = ?, passport_number = ?, passport_issue_date = ?, inn = ?
    WHERE id = ? AND user_id = ?
  `);
  
  const result = update.run(
    name, first_name, last_name, middle_name, email, phone,
    birth_date, passport_series, passport_number, passport_issue_date, inn,
    req.params.id, req.user.id
  );
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Получатель не найден' });
  }
  
  const recipient = db.prepare('SELECT * FROM recipients WHERE id = ?').get(req.params.id);
  res.json(recipient);
});

app.delete('/api/recipients/:id', getUserFromRequest, (req, res) => {
  const result = db.prepare('DELETE FROM recipients WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Получатель не найден' });
  }
  res.json({ success: true });
});

// ==================== ORDERS ====================
app.get('/api/orders', getUserFromRequest, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  // Преобразуем boolean значения
  const formattedOrders = orders.map(order => ({
    ...order,
    consolidation: Boolean(order.consolidation),
    remove_postal_packaging: Boolean(order.remove_postal_packaging),
    remove_original_packaging: Boolean(order.remove_original_packaging),
    photo_report: Boolean(order.photo_report)
  }));
  res.json(formattedOrders);
});

app.get('/api/orders/:id', getUserFromRequest, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!order) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }
  res.json({
    ...order,
    consolidation: Boolean(order.consolidation),
    remove_postal_packaging: Boolean(order.remove_postal_packaging),
    remove_original_packaging: Boolean(order.remove_original_packaging),
    photo_report: Boolean(order.photo_report)
  });
});

app.post('/api/orders', getUserFromRequest, (req, res) => {
  const {
    product_name, link, price, quantity, photo, warehouse_photo, comment,
    check_service, consolidation, remove_postal_packaging, remove_original_packaging,
    photo_report, status, status_date, track_number
  } = req.body;
  
  const insert = db.prepare(`
    INSERT INTO orders (
      user_id, product_name, link, price, quantity, photo, warehouse_photo, comment,
      check_service, consolidation, remove_postal_packaging, remove_original_packaging,
      photo_report, status, status_date, track_number
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = insert.run(
    req.user.id, product_name, link, price, quantity || 1, photo, warehouse_photo, comment,
    check_service, consolidation ? 1 : 0, remove_postal_packaging ? 1 : 0,
    remove_original_packaging ? 1 : 0, photo_report ? 1 : 0,
    status || 'Ожидается на складе', status_date, track_number || `CN${Date.now()}`
  );
  
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({
    ...order,
    consolidation: Boolean(order.consolidation),
    remove_postal_packaging: Boolean(order.remove_postal_packaging),
    remove_original_packaging: Boolean(order.remove_original_packaging),
    photo_report: Boolean(order.photo_report)
  });
});

app.put('/api/orders/:id', getUserFromRequest, (req, res) => {
  const {
    product_name, link, price, quantity, photo, warehouse_photo, comment,
    check_service, consolidation, remove_postal_packaging, remove_original_packaging,
    photo_report, status, status_date, track_number
  } = req.body;
  
  const update = db.prepare(`
    UPDATE orders SET
      product_name = ?, link = ?, price = ?, quantity = ?, photo = ?, warehouse_photo = ?, comment = ?,
      check_service = ?, consolidation = ?, remove_postal_packaging = ?, remove_original_packaging = ?,
      photo_report = ?, status = ?, status_date = ?, track_number = ?
    WHERE id = ? AND user_id = ?
  `);
  
  const result = update.run(
    product_name, link, price, quantity, photo, warehouse_photo, comment,
    check_service, consolidation ? 1 : 0, remove_postal_packaging ? 1 : 0,
    remove_original_packaging ? 1 : 0, photo_report ? 1 : 0,
    status, status_date, track_number,
    req.params.id, req.user.id
  );
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }
  
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json({
    ...order,
    consolidation: Boolean(order.consolidation),
    remove_postal_packaging: Boolean(order.remove_postal_packaging),
    remove_original_packaging: Boolean(order.remove_original_packaging),
    photo_report: Boolean(order.photo_report)
  });
});

app.delete('/api/orders/:id', getUserFromRequest, (req, res) => {
  const result = db.prepare('DELETE FROM orders WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Заказ не найден' });
  }
  res.json({ success: true });
});

app.delete('/api/orders', getUserFromRequest, (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Необходимо передать массив ID' });
  }
  
  const placeholders = ids.map(() => '?').join(',');
  const result = db.prepare(`DELETE FROM orders WHERE id IN (${placeholders}) AND user_id = ?`).run(...ids, req.user.id);
  res.json({ success: true, deleted: result.changes });
});

// ==================== DELIVERY ADDRESSES ====================
app.get('/api/delivery-addresses', getUserFromRequest, (req, res) => {
  const addresses = db.prepare('SELECT * FROM delivery_addresses WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(addresses);
});

app.post('/api/delivery-addresses', getUserFromRequest, (req, res) => {
  const { name, company, address } = req.body;
  
  const insert = db.prepare('INSERT INTO delivery_addresses (user_id, name, company, address) VALUES (?, ?, ?, ?)');
  const result = insert.run(req.user.id, name, company, address);
  
  const deliveryAddress = db.prepare('SELECT * FROM delivery_addresses WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(deliveryAddress);
});

app.put('/api/delivery-addresses/:id', getUserFromRequest, (req, res) => {
  const { name, company, address } = req.body;
  
  const update = db.prepare('UPDATE delivery_addresses SET name = ?, company = ?, address = ? WHERE id = ? AND user_id = ?');
  const result = update.run(name, company, address, req.params.id, req.user.id);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Адрес не найден' });
  }
  
  const deliveryAddress = db.prepare('SELECT * FROM delivery_addresses WHERE id = ?').get(req.params.id);
  res.json(deliveryAddress);
});

app.delete('/api/delivery-addresses/:id', getUserFromRequest, (req, res) => {
  const result = db.prepare('DELETE FROM delivery_addresses WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Адрес не найден' });
  }
  res.json({ success: true });
});

// ==================== CONSOLIDATIONS ====================
app.get('/api/consolidations', getUserFromRequest, (req, res) => {
  const consolidations = db.prepare('SELECT * FROM consolidations WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(consolidations);
});

app.post('/api/consolidations', getUserFromRequest, (req, res) => {
  const { name, description, order_ids, recipient_id, delivery_address_id, status } = req.body;
  
  const insert = db.prepare(`
    INSERT INTO consolidations (user_id, name, description, order_ids, recipient_id, delivery_address_id, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = insert.run(
    req.user.id, name, description, JSON.stringify(order_ids || []), recipient_id, delivery_address_id, status || 'Создано'
  );
  
  const consolidation = db.prepare('SELECT * FROM consolidations WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(consolidation);
});

app.put('/api/consolidations/:id', getUserFromRequest, (req, res) => {
  const { name, description, order_ids, recipient_id, delivery_address_id, status } = req.body;
  
  const update = db.prepare(`
    UPDATE consolidations SET
      name = ?, description = ?, order_ids = ?, recipient_id = ?, delivery_address_id = ?, status = ?
    WHERE id = ? AND user_id = ?
  `);
  
  const result = update.run(
    name, description, JSON.stringify(order_ids || []), recipient_id, delivery_address_id, status,
    req.params.id, req.user.id
  );
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Объединение не найдено' });
  }
  
  const consolidation = db.prepare('SELECT * FROM consolidations WHERE id = ?').get(req.params.id);
  res.json(consolidation);
});

app.delete('/api/consolidations/:id', getUserFromRequest, (req, res) => {
  const result = db.prepare('DELETE FROM consolidations WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Объединение не найдено' });
  }
  res.json({ success: true });
});

// Корневой путь
app.get('/', (req, res) => {
  res.json({ 
    message: 'Telegram Logistics API',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      apiHealth: '/api/health',
      recipients: '/api/recipients',
      orders: '/api/orders',
      deliveryAddresses: '/api/delivery-addresses',
      consolidations: '/api/consolidations'
    }
  });
});

// Health check (добавляем также без префикса для проверки)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка:', err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📊 База данных: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM получен, закрываем сервер...');
  server.close(() => {
    console.log('Сервер закрыт');
    db.close();
    process.exit(0);
  });
});
