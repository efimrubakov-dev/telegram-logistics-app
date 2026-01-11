import { useState, useEffect } from 'react';
import type { ScreenType } from '../types';
import './AddDeliveryAddressScreen.css';

interface AddDeliveryAddressScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

interface DeliveryAddress {
  id: string;
  name: string;
  company: string;
  address: string;
  createdAt: string;
}

function AddDeliveryAddressScreen({ onNavigate }: AddDeliveryAddressScreenProps) {
  const [addressName, setAddressName] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const deliveryCompanies = ['CDEK', 'Почта России', 'DPD', 'BUS Курьер'];

  useEffect(() => {
    const editingAddressId = localStorage.getItem('editingDeliveryAddressId');
    if (editingAddressId) {
      setEditingId(editingAddressId);
      const addresses = JSON.parse(localStorage.getItem('deliveryAddresses') || '[]');
      const addressData = addresses.find((a: DeliveryAddress) => a.id === editingAddressId);
      
      if (addressData) {
        setAddressName(addressData.name || '');
        setCompany(addressData.company || '');
        setAddress(addressData.address || '');
      }
    } else {
      setEditingId(null);
      setAddressName('');
      setCompany('');
      setAddress('');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const addresses: DeliveryAddress[] = JSON.parse(localStorage.getItem('deliveryAddresses') || '[]');
    
    if (editingId) {
      // Обновляем существующий адрес
      const updatedAddresses = addresses.map((a) => 
        a.id === editingId 
          ? {
              ...a,
              name: addressName,
              company,
              address
            }
          : a
      );
      localStorage.setItem('deliveryAddresses', JSON.stringify(updatedAddresses));
      localStorage.removeItem('editingDeliveryAddressId');
    } else {
      // Создаем новый адрес
      const newAddress: DeliveryAddress = {
        id: Date.now().toString(),
        name: addressName,
        company,
        address,
        createdAt: new Date().toISOString()
      };
      
      addresses.push(newAddress);
      localStorage.setItem('deliveryAddresses', JSON.stringify(addresses));
    }
    
    onNavigate('delivery-address');
  };

  return (
    <div className="add-delivery-address-screen">
      <h1 className="screen-title">{editingId ? 'Редактировать адрес' : 'Добавить новый адрес'}</h1>
      
      <form onSubmit={handleSubmit} className="delivery-address-form">
        <div className="form-group">
          <label>Наименование адреса:</label>
          <input
            type="text"
            value={addressName}
            onChange={(e) => setAddressName(e.target.value)}
            placeholder="Придумайте название адреса"
            required
          />
        </div>

        <div className="form-group">
          <label>Выберите компанию доставки по РФ:</label>
          <div className="radio-group">
            {deliveryCompanies.map((comp) => (
              <label key={comp} className="radio-label">
                <input
                  type="radio"
                  name="company"
                  value={comp}
                  checked={company === comp}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
                <span>{comp}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Адрес доставки</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Введите адрес доставки"
            rows={4}
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => {
            localStorage.removeItem('editingDeliveryAddressId');
            onNavigate('delivery-address');
          }}>
            Отмена
          </button>
          <button type="submit" className="btn-primary">
            {editingId ? 'Сохранить изменения' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDeliveryAddressScreen;
