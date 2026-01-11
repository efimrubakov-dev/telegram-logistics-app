// Простые админ-роуты для просмотра данных
// ВНИМАНИЕ: В продакшене добавьте аутентификацию!

import { dbGet, dbAll } from './server.js';

export function setupAdminRoutes(app) {
  // Просмотр всех пользователей
  app.get('/admin/users', async (req, res) => {
    try {
      const users = await dbAll('SELECT * FROM users ORDER BY created_at DESC');
      res.json({ count: users.length, users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Просмотр всех получателей
  app.get('/admin/recipients', async (req, res) => {
    try {
      const recipients = await dbAll(`
        SELECT r.*, u.username, u.telegram_id 
        FROM recipients r 
        LEFT JOIN users u ON r.user_id = u.id 
        ORDER BY r.created_at DESC
      `);
      res.json({ count: recipients.length, recipients });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Просмотр всех заказов
  app.get('/admin/orders', async (req, res) => {
    try {
      const orders = await dbAll(`
        SELECT o.*, u.username, u.telegram_id 
        FROM orders o 
        LEFT JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC
      `);
      res.json({ count: orders.length, orders });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Просмотр всех объединений
  app.get('/admin/consolidations', async (req, res) => {
    try {
      const consolidations = await dbAll(`
        SELECT c.*, u.username, u.telegram_id 
        FROM consolidations c 
        LEFT JOIN users u ON c.user_id = u.id 
        ORDER BY c.created_at DESC
      `);
      res.json({ count: consolidations.length, consolidations });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Просмотр всех адресов доставки
  app.get('/admin/delivery-addresses', async (req, res) => {
    try {
      const addresses = await dbAll(`
        SELECT d.*, u.username, u.telegram_id 
        FROM delivery_addresses d 
        LEFT JOIN users u ON d.user_id = u.id 
        ORDER BY d.created_at DESC
      `);
      res.json({ count: addresses.length, addresses });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Общая статистика
  app.get('/admin/stats', async (req, res) => {
    try {
      const stats = {
        users: await dbGet('SELECT COUNT(*) as count FROM users'),
        recipients: await dbGet('SELECT COUNT(*) as count FROM recipients'),
        orders: await dbGet('SELECT COUNT(*) as count FROM orders'),
        consolidations: await dbGet('SELECT COUNT(*) as count FROM consolidations'),
        deliveryAddresses: await dbGet('SELECT COUNT(*) as count FROM delivery_addresses')
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
