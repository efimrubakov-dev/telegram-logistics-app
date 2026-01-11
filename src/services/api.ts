// API сервис для работы с backend

// URL вашего Render сервиса
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://telegram-logistics-app.onrender.com/api';

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
  const headers = {
    ...getHeaders(),
    ...options.headers
  };
  
  console.log(`🌐 API запрос: ${options.method || 'GET'} ${url}`);
  console.log('📋 Заголовки:', headers);
  if (options.body) {
    console.log('📦 Тело запроса:', options.body);
  }
  
  const response = await fetch(url, {
    ...options,
    headers
  });

  console.log(`📥 Ответ сервера: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Ошибка ответа сервера:', errorText);
    let error;
    try {
      error = JSON.parse(errorText);
    } catch {
      error = { error: errorText || 'Ошибка сервера' };
    }
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  console.log('✅ Успешный ответ:', data);
  return data;
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
  getById: (id: string) => request<any>(`/delivery-addresses/${id}`),
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
export const healthCheck = async () => {
  try {
    const url = `${API_BASE_URL}/health`;
    console.log('🏥 Health check запрос:', url);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('🏥 Health check ответ:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Health check ошибка:', errorText);
      throw new Error(`Health check failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Health check успешен:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Health check исключение:', error);
    throw error;
  }
};
