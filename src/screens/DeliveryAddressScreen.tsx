import { useState, useEffect } from 'react';
import type { ScreenType } from '../types';
import './DeliveryAddressScreen.css';

interface DeliveryAddressScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

interface DeliveryAddress {
  id: string;
  name: string;
  company: string;
  address: string;
  createdAt: string;
}

function DeliveryAddressScreen({ onNavigate }: DeliveryAddressScreenProps) {
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>([]);

  useEffect(() => {
    const loadAddresses = () => {
      const addresses = JSON.parse(localStorage.getItem('deliveryAddresses') || '[]');
      setDeliveryAddresses(addresses);
    };
    loadAddresses();
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот адрес?')) {
      const updatedAddresses = deliveryAddresses.filter(a => a.id !== id);
      setDeliveryAddresses(updatedAddresses);
      localStorage.setItem('deliveryAddresses', JSON.stringify(updatedAddresses));
    }
  };

  const handleEdit = (id: string) => {
    localStorage.setItem('editingDeliveryAddressId', id);
    onNavigate('add-delivery-address');
  };
  const pvzLocations = [
    {
      city: 'Уссурийск',
      addresses: [
        'Уссурийск, ул. Краснознамённая 178Б, офис 8',
        'Уссурийск, ул. Александра Францева 23А'
      ]
    },
    {
      city: 'Владивосток',
      addresses: [
        'Владивосток, ул. Днепровская 21 ст4',
        'Владивосток, ул. Русская 27д'
      ]
    },
    {
      city: 'Москва',
      addresses: [
        'Мичуринский проспект 16'
      ]
    }
  ];

  return (
    <div className="delivery-address-screen">
      <h1 className="screen-title">Забрать через ПВЗ ES Express</h1>
      
      <p className="section-subtitle">Доступные пункты выдачи заказов c ES Express</p>

      <div className="pvz-list">
        {pvzLocations.map((location, cityIndex) => (
          <div key={cityIndex} className="city-section">
            <h2 className="city-name">{location.city}</h2>
            {location.addresses.map((address, addressIndex) => (
              <div key={addressIndex} className="address-card">
                <div className="address-info">
                  <p className="address-label">Адрес пункта выдачи:</p>
                  <p className="address-value">{address}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="partner-section">
        <h2 className="section-title">Получить посылку через партнера</h2>
        <button 
          className="add-address-btn"
          onClick={() => {
            localStorage.removeItem('editingDeliveryAddressId');
            onNavigate('add-delivery-address');
          }}
        >
          + Добавить адрес
        </button>
        
        {deliveryAddresses.length === 0 ? (
          <div className="empty-address-message">
            <p>Вы пока еще не создали адрес для доставки курьерской компанией.</p>
          </div>
        ) : (
          <div className="delivery-addresses-list">
            {deliveryAddresses.map((address) => (
              <div key={address.id} className="delivery-address-card">
                <div className="delivery-address-card-content">
                  <div className="delivery-address-name">{address.name}</div>
                  <div className="delivery-address-company">{address.company}</div>
                  <div className="delivery-address-text">{address.address}</div>
                </div>
                <div className="delivery-address-actions">
                  <button
                    className="delivery-action-btn edit-btn"
                    onClick={() => handleEdit(address.id)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    className="delivery-action-btn delete-btn"
                    onClick={() => handleDelete(address.id)}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryAddressScreen;
