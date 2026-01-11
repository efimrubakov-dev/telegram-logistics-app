import { useState, useEffect } from 'react';
import type { ScreenType } from '../types';
import { deliveryAddressesStorage } from '../services/storage';
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
    const loadEditingAddress = async () => {
      const editingAddressId = localStorage.getItem('editingDeliveryAddressId');
      if (editingAddressId) {
        setEditingId(editingAddressId);
        try {
          const addressData = await deliveryAddressesStorage.getById(editingAddressId);
          if (addressData) {
            setAddressName(addressData.name || '');
            setCompany(addressData.company || '');
            setAddress(addressData.address || '');
          }
        } catch (error) {
          console.error('Ошибка загрузки адреса:', error);
        }
      } else {
        setEditingId(null);
        setAddressName('');
        setCompany('');
        setAddress('');
      }
    };
    loadEditingAddress();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const addressData = {
        name: addressName,
        company,
        address
      };

      if (editingId) {
        // Обновляем существующий адрес
        await deliveryAddressesStorage.update(editingId, addressData);
        localStorage.removeItem('editingDeliveryAddressId');
      } else {
        // Создаем новый адрес
        await deliveryAddressesStorage.create(addressData);
      }
      
      onNavigate('delivery-address');
    } catch (error) {
      console.error('Ошибка сохранения адреса:', error);
      alert('Ошибка при сохранении адреса. Попробуйте еще раз.');
    }
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
