import { useState } from 'react';
import type { ScreenType } from '../types';
import './HomeScreen.css';

interface HomeScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [isWarehouseExpanded, setIsWarehouseExpanded] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const warehouseData = {
    name: 'DESexpress二十二',
    phone: '15904678656',
    address: '黑龙江省鸡西市鸡冠区东太三组义立国际多邮库批发客户二十二',
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  return (
    <div className="home-screen">
      <div className="balance-card-horizontal">
        <div className="balance-info">
          <div className="balance-label">Мой баланс</div>
          <div className="balance-amount">0 ₽</div>
        </div>
        <button className="balance-btn-compact">Пополнить</button>
      </div>

      <div className="action-buttons-grid">
        <button 
          className="action-btn-compact"
          onClick={() => onNavigate('create-order')}
        >
          <span className="action-icon-small">📦</span>
          <span className="action-text-large">Создать заказ</span>
        </button>

        <button 
          className="action-btn-compact"
          onClick={() => onNavigate('create-consolidation')}
        >
          <span className="action-icon-small">🧩</span>
          <span className="action-text-large">Создать объединение</span>
        </button>

        <button 
          className="action-btn-compact"
          onClick={() => onNavigate('recipients')}
        >
          <span className="action-icon-small">👥</span>
          <span className="action-text-large">Получатели</span>
        </button>

        <button 
          className="action-btn-compact"
          onClick={() => onNavigate('shopping-help')}
        >
          <span className="action-icon-small">🛒</span>
          <span className="action-text-large">Помощь в покупке</span>
        </button>

        <button 
          className="action-btn-compact"
          onClick={() => onNavigate('products')}
        >
          <span className="action-icon-small">📦</span>
          <span className="action-text-large">Товары</span>
        </button>

        <button 
          className="action-btn-compact"
          onClick={() => onNavigate('instructions')}
        >
          <span className="action-icon-small">📋</span>
          <span className="action-text-large">Инструкция по заказам</span>
        </button>

        <button 
          className="action-btn-compact"
          onClick={() => onNavigate('parcels')}
        >
          <span className="action-icon-small">📮</span>
          <span className="action-text-large">Посылки</span>
        </button>

        <button 
          className="action-btn-compact"
          onClick={() => onNavigate('calculator')}
        >
          <span className="action-icon-small">🧮</span>
          <span className="action-text-large">Калькулятор</span>
        </button>
      </div>

      <div className="warehouse-section">
        <div 
          className="warehouse-banner" 
          onClick={() => setIsWarehouseExpanded(!isWarehouseExpanded)}
        >
          <div className="warehouse-banner-content">
            <span className="warehouse-icon">📍</span>
            <span className="warehouse-text">Адрес склада в Китае</span>
          </div>
          <span className={`warehouse-arrow ${isWarehouseExpanded ? 'expanded' : ''}`}>
            ▼
          </span>
        </div>

        <div className={`warehouse-details ${isWarehouseExpanded ? 'expanded' : ''}`}>
          <div className="warehouse-info-hint">
            Отправляйте товары на этот адрес. Используйте кнопки копирования для удобства.
          </div>

          <div className="address-field">
            <label>Имя получателя</label>
            <div className="field-with-copy">
              <div className="field-value">{warehouseData.name}</div>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(warehouseData.name, 'name')}
              >
                {copiedField === 'name' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="address-field">
            <label>Номер телефона</label>
            <div className="field-with-copy">
              <div className="field-value">{warehouseData.phone}</div>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(warehouseData.phone, 'phone')}
              >
                {copiedField === 'phone' ? '✓' : '📋'}
              </button>
            </div>
          </div>

          <div className="address-field">
            <label>Адрес</label>
            <div className="field-with-copy">
              <div className="field-value address-text">{warehouseData.address}</div>
              <button 
                className="copy-btn"
                onClick={() => copyToClipboard(warehouseData.address, 'address')}
              >
                {copiedField === 'address' ? '✓' : '📋'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
