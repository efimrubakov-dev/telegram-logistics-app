import { useState } from 'react';
import './WarehouseAddressScreen.css';

function WarehouseAddressScreen() {
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
    <div className="warehouse-screen">
      <h1 className="screen-title">Адрес склада в Китае</h1>
      
      <div className="info-card">
        <p className="info-hint">
          Отправляйте товары на этот адрес. Используйте кнопки копирования для удобства.
        </p>

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
  );
}

export default WarehouseAddressScreen;
