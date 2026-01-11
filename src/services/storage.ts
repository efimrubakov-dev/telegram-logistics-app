// Сервис для работы с хранилищем (localStorage или API)
// Автоматически определяет, использовать ли API или localStorage

import { recipientsAPI, ordersAPI, deliveryAddressesAPI, consolidationsAPI, healthCheck } from './api';

// Проверяем доступность API
let useAPI = false;
let apiChecked = false;

async function checkAPI() {
  if (apiChecked) return useAPI;
  
  try {
    await healthCheck();
    useAPI = true;
    console.log('✅ API доступен, используем backend');
  } catch (error) {
    useAPI = false;
    console.log('⚠️ API недоступен, используем localStorage');
  }
  
  apiChecked = true;
  return useAPI;
}

// Получатели
export const recipientsStorage = {
  async getAll() {
    await checkAPI();
    if (useAPI) {
      try {
        return await recipientsAPI.getAll();
      } catch (error) {
        console.error('Ошибка API, переключаемся на localStorage:', error);
        useAPI = false;
      }
    }
    return JSON.parse(localStorage.getItem('recipients') || '[]');
  },

  async getById(id: string) {
    await checkAPI();
    if (useAPI) {
      try {
        return await recipientsAPI.getById(id);
      } catch (error) {
        useAPI = false;
      }
    }
    const recipients = JSON.parse(localStorage.getItem('recipients') || '[]');
    return recipients.find((r: any) => r.id === id);
  },

  async create(data: any) {
    await checkAPI();
    if (useAPI) {
      try {
        console.log('📤 Отправка получателя на API:', data);
        const result = await recipientsAPI.create(data);
        console.log('✅ Получатель успешно создан в API:', result);
        return result;
      } catch (error: any) {
        console.error('❌ Ошибка при создании получателя в API:', error);
        throw error;
      }
    }
    console.warn('⚠️ API недоступен, сохраняем в localStorage');
    const recipients = JSON.parse(localStorage.getItem('recipients') || '[]');
    const newRecipient = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    recipients.push(newRecipient);
    localStorage.setItem('recipients', JSON.stringify(recipients));
    return newRecipient;
  },

  async update(id: string, data: any) {
    await checkAPI();
    if (useAPI) {
      try {
        return await recipientsAPI.update(id, data);
      } catch (error) {
        useAPI = false;
      }
    }
    const recipients = JSON.parse(localStorage.getItem('recipients') || '[]');
    const updated = recipients.map((r: any) => r.id === id ? { ...r, ...data } : r);
    localStorage.setItem('recipients', JSON.stringify(updated));
    return updated.find((r: any) => r.id === id);
  },

  async delete(id: string) {
    await checkAPI();
    if (useAPI) {
      try {
        return await recipientsAPI.delete(id);
      } catch (error) {
        useAPI = false;
      }
    }
    const recipients = JSON.parse(localStorage.getItem('recipients') || '[]');
    const filtered = recipients.filter((r: any) => r.id !== id);
    localStorage.setItem('recipients', JSON.stringify(filtered));
    return { success: true };
  }
};

// Заказы
export const ordersStorage = {
  async getAll() {
    await checkAPI();
    if (useAPI) {
      try {
        return await ordersAPI.getAll();
      } catch (error) {
        useAPI = false;
      }
    }
    return JSON.parse(localStorage.getItem('orders') || '[]');
  },

  async getById(id: string) {
    await checkAPI();
    if (useAPI) {
      try {
        return await ordersAPI.getById(id);
      } catch (error) {
        useAPI = false;
      }
    }
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.find((o: any) => o.id === id);
  },

  async create(data: any) {
    await checkAPI();
    if (useAPI) {
      try {
        console.log('📤 Отправка заказа на API:', data);
        const result = await ordersAPI.create(data);
        console.log('✅ Заказ успешно создан в API:', result);
        return result;
      } catch (error: any) {
        console.error('❌ Ошибка при создании заказа в API:', error);
        console.error('Детали ошибки:', error.message);
        // Не переключаемся на localStorage, выбрасываем ошибку
        throw error;
      }
    }
    console.warn('⚠️ API недоступен, сохраняем в localStorage');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const newOrder = {
      ...data,
      id: Date.now().toString(),
      trackNumber: data.trackNumber || `CN${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    return newOrder;
  },

  async update(id: string, data: any) {
    await checkAPI();
    if (useAPI) {
      try {
        return await ordersAPI.update(id, data);
      } catch (error) {
        useAPI = false;
      }
    }
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updated = orders.map((o: any) => o.id === id ? { ...o, ...data } : o);
    localStorage.setItem('orders', JSON.stringify(updated));
    return updated.find((o: any) => o.id === id);
  },

  async delete(id: string) {
    await checkAPI();
    if (useAPI) {
      try {
        return await ordersAPI.delete(id);
      } catch (error) {
        useAPI = false;
      }
    }
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const filtered = orders.filter((o: any) => o.id !== id);
    localStorage.setItem('orders', JSON.stringify(filtered));
    return { success: true };
  },

  async deleteMany(ids: string[]) {
    await checkAPI();
    if (useAPI) {
      try {
        return await ordersAPI.deleteMany(ids);
      } catch (error) {
        useAPI = false;
      }
    }
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const filtered = orders.filter((o: any) => !ids.includes(o.id));
    localStorage.setItem('orders', JSON.stringify(filtered));
    return { success: true, deleted: ids.length };
  }
};

// Адреса доставки
export const deliveryAddressesStorage = {
  async getAll() {
    await checkAPI();
    if (useAPI) {
      try {
        return await deliveryAddressesAPI.getAll();
      } catch (error) {
        useAPI = false;
      }
    }
    return JSON.parse(localStorage.getItem('deliveryAddresses') || '[]');
  },

  async getById(id: string) {
    await checkAPI();
    if (useAPI) {
      try {
        return await deliveryAddressesAPI.getById(id);
      } catch (error) {
        useAPI = false;
      }
    }
    const addresses = JSON.parse(localStorage.getItem('deliveryAddresses') || '[]');
    return addresses.find((a: any) => a.id === id);
  },

  async create(data: any) {
    await checkAPI();
    if (useAPI) {
      try {
        return await deliveryAddressesAPI.create(data);
      } catch (error) {
        useAPI = false;
      }
    }
    const addresses = JSON.parse(localStorage.getItem('deliveryAddresses') || '[]');
    const newAddress = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    addresses.push(newAddress);
    localStorage.setItem('deliveryAddresses', JSON.stringify(addresses));
    return newAddress;
  },

  async update(id: string, data: any) {
    await checkAPI();
    if (useAPI) {
      try {
        return await deliveryAddressesAPI.update(id, data);
      } catch (error) {
        useAPI = false;
      }
    }
    const addresses = JSON.parse(localStorage.getItem('deliveryAddresses') || '[]');
    const updated = addresses.map((a: any) => a.id === id ? { ...a, ...data } : a);
    localStorage.setItem('deliveryAddresses', JSON.stringify(updated));
    return updated.find((a: any) => a.id === id);
  },

  async delete(id: string) {
    await checkAPI();
    if (useAPI) {
      try {
        return await deliveryAddressesAPI.delete(id);
      } catch (error) {
        useAPI = false;
      }
    }
    const addresses = JSON.parse(localStorage.getItem('deliveryAddresses') || '[]');
    const filtered = addresses.filter((a: any) => a.id !== id);
    localStorage.setItem('deliveryAddresses', JSON.stringify(filtered));
    return { success: true };
  }
};

// Объединения
export const consolidationsStorage = {
  async getAll() {
    await checkAPI();
    if (useAPI) {
      try {
        return await consolidationsAPI.getAll();
      } catch (error) {
        useAPI = false;
      }
    }
    return JSON.parse(localStorage.getItem('consolidations') || '[]');
  },

  async create(data: any) {
    await checkAPI();
    if (useAPI) {
      try {
        return await consolidationsAPI.create(data);
      } catch (error) {
        useAPI = false;
      }
    }
    const consolidations = JSON.parse(localStorage.getItem('consolidations') || '[]');
    const newConsolidation = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    consolidations.push(newConsolidation);
    localStorage.setItem('consolidations', JSON.stringify(consolidations));
    return newConsolidation;
  },

  async update(id: string, data: any) {
    await checkAPI();
    if (useAPI) {
      try {
        return await consolidationsAPI.update(id, data);
      } catch (error) {
        useAPI = false;
      }
    }
    const consolidations = JSON.parse(localStorage.getItem('consolidations') || '[]');
    const updated = consolidations.map((c: any) => c.id === id ? { ...c, ...data } : c);
    localStorage.setItem('consolidations', JSON.stringify(updated));
    return updated.find((c: any) => c.id === id);
  },

  async delete(id: string) {
    await checkAPI();
    if (useAPI) {
      try {
        return await consolidationsAPI.delete(id);
      } catch (error) {
        useAPI = false;
      }
    }
    const consolidations = JSON.parse(localStorage.getItem('consolidations') || '[]');
    const filtered = consolidations.filter((c: any) => c.id !== id);
    localStorage.setItem('consolidations', JSON.stringify(filtered));
    return { success: true };
  }
};
