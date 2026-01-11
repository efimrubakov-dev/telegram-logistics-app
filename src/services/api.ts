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
// Кодируем значения заголовков в base64, чтобы избежать проблем с не-ASCII символами
function getHeaders(): HeadersInit {
  const user = getTelegramUser();
  // Кодируем значения, которые могут содержать не-ASCII символы
  const encodeHeader = (value: string) => {
    if (!value) return '';
    // Используем encodeURIComponent для безопасной передачи
    return encodeURIComponent(value);
  };
  
  return {
    'Content-Type': 'application/json',
    'x-telegram-id': user.telegram_id,
    'x-telegram-username': encodeHeader(user.username),
    'x-telegram-first-name': encodeHeader(user.first_name),
    'x-telegram-last-name': encodeHeader(user.last_name)
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
  // Логируем заголовки (показываем закодированные значения)
  const headersForLog: any = {};
  for (const [key, value] of Object.entries(headers)) {
    if (key.includes('telegram') && typeof value === 'string' && value.length > 0) {
      headersForLog[key] = `[encoded: ${value.substring(0, 20)}...]`;
    } else {
      headersForLog[key] = value;
    }
  }
  console.log('📋 Заголовки:', headersForLog);
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
  const url = `${API_BASE_URL}/health`;
  console.log('🏥 Health check запрос:', url);
  console.log('🏥 API_BASE_URL:', API_BASE_URL);
  
  // Создаем AbortController для timeout (более совместимый способ)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 секунд timeout (сервер на Render может спать)
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('🏥 Health check ответ получен:', response.status, response.statusText);
    console.log('🏥 Response ok:', response.ok);
    console.log('🏥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Health check ошибка HTTP:', response.status, errorText);
      throw new Error(`Health check failed: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Health check успешен:', data);
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      console.error('❌ Health check timeout (сервер не отвечает за 10 секунд)');
      console.error('💡 Возможно, сервер на Render спит (free tier). Первый запрос может занять до 60 секунд.');
      throw new Error('Сервер не отвечает (timeout). Попробуйте еще раз через несколько секунд.');
    }
    if (error.name === 'TypeError') {
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        console.error('❌ Health check network error (CORS или сеть)');
        console.error('Детали:', error.message);
        throw new Error('Ошибка сети. Проверьте подключение к интернету и CORS настройки сервера.');
      }
    }
    console.error('❌ Health check исключение:', error);
    console.error('Тип ошибки:', error.name);
    console.error('Сообщение:', error.message);
    console.error('Stack:', error.stack);
    throw error;
  }
};
