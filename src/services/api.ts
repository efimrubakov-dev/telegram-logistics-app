// API сервис для работы с backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Получаем данные пользователя из Telegram
function getTelegramUser() {
  const tg = (window as any).Telegram?.WebApp;
  if (tg) {
    const user = tg.initDataUnsafe?.user;
    return {
      telegram_id: user?.id?.toString() || '1',
      username: user?.username || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || ''
    };
  }
  return {
    telegram_id: '1',
    username: '',
    first_name: '',
    last_name: ''
  };
}

// Создаем заголовки с данными Telegram
function getHeaders(): HeadersInit {
  const user = getTelegramUser();
  return {
    'Content-Type': 'application/json',
    'x-telegram-id': user.telegram_id,
    'x-telegram-username': user.username,
    'x-telegram-first-name': user.first_name,
    'x-telegram-last-name': user.last_name
  };
}

// Базовая функция для запросов
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// API для получателей
export const recipientsAPI = {
  getAll: () => request<any[]>('/recipients'),
  getById: (id: string) => request<any>(`/recipients/${id}`),
  create: (data: any) => request<any>('/recipients', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id: string, data: any) => request<any>(`/recipients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id: string) => request<{ success: boolean }>(`/recipients/${id}`, {
    method: 'DELETE'
  })
};

// API для заказов
export const ordersAPI = {
  getAll: () => request<any[]>('/orders'),
  getById: (id: string) => request<any>(`/orders/${id}`),
  create: (data: any) => request<any>('/orders', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id: string, data: any) => request<any>(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id: string) => request<{ success: boolean }>(`/orders/${id}`, {
    method: 'DELETE'
  }),
  deleteMany: (ids: string[]) => request<{ success: boolean; deleted: number }>('/orders', {
    method: 'DELETE',
    body: JSON.stringify({ ids })
  })
};

// API для адресов доставки
export const deliveryAddressesAPI = {
  getAll: () => request<any[]>('/delivery-addresses'),
  create: (data: any) => request<any>('/delivery-addresses', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id: string, data: any) => request<any>(`/delivery-addresses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id: string) => request<{ success: boolean }>(`/delivery-addresses/${id}`, {
    method: 'DELETE'
  })
};

// API для объединений
export const consolidationsAPI = {
  getAll: () => request<any[]>('/consolidations'),
  create: (data: any) => request<any>('/consolidations', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id: string, data: any) => request<any>(`/consolidations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id: string) => request<{ success: boolean }>(`/consolidations/${id}`, {
    method: 'DELETE'
  })
};

// Проверка доступности API
export const healthCheck = () => request<{ status: string; timestamp: string }>('/health');
