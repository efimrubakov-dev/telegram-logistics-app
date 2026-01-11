// Типы для навигации
export type ScreenType = 
  | 'home' 
  | 'orders' 
  | 'consolidations' 
  | 'check' 
  | 'calculator'
  | 'profile'
  | 'create-order'
  | 'create-consolidation'
  | 'recipients'
  | 'create-recipient'
  | 'warehouse-address'
  | 'products'
  | 'instructions'
  | 'parcels'
  | 'shopping-help'
  | 'products-sent'
  | 'delivery-address'
  | 'add-delivery-address'
  | 'products-archive'
  | 'products-returns'
  | 'products-problematic';

// Тип для пользователя
export interface User {
  telegramUsername: string;
  firstName: string;
  lastName: string;
  middleName: string;
  gender: 'male' | 'female';
  phone: string;
  email: string;
}

// Тип для заказа
export interface Order {
  id: string;
  date: string;
  status: string;
  trackNumber: string;
}

// Тип для объединения
export interface Consolidation {
  id: string;
  name: string;
  date: string;
  status: string;
}

// Тип для получателя
export interface Recipient {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
}
