import { useState, useRef, useEffect } from 'react';
import type { ScreenType } from '../types';
import { ordersStorage } from '../services/storage';
import './CreateOrderScreen.css';

interface CreateOrderScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

interface Order {
  id: string;
  productName: string;
  link: string;
  price: number;
  quantity: number;
  photo: string | null;
  warehousePhoto: string | null;
  comment: string;
  checkService: string;
  consolidation: boolean;
  removePostalPackaging: boolean;
  removeOriginalPackaging: boolean;
  photoReport: boolean;
  status: string;
  statusDate: string;
  trackNumber: string;
  createdAt: string;
}

function CreateOrderScreen({ onNavigate }: CreateOrderScreenProps) {
  const [productName, setProductName] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [checkService, setCheckService] = useState<'with-check' | 'without-check' | ''>('');
  const [consolidation, setConsolidation] = useState(true);
  const [removePostalPackaging, setRemovePostalPackaging] = useState(false);
  const [removeOriginalPackaging, setRemoveOriginalPackaging] = useState(false);
  const [photoReport, setPhotoReport] = useState(false);
  const [showCheckDetails, setShowCheckDetails] = useState(false);
  const [showNoCheckDetails, setShowNoCheckDetails] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadEditingOrder = async () => {
      const editingOrderId = localStorage.getItem('editingOrderId');
      if (editingOrderId) {
        setEditingId(editingOrderId);
        try {
          const order = await ordersStorage.getById(editingOrderId);
          if (order) {
            setProductName(order.product_name || order.productName || '');
            setLink(order.link || '');
            setPrice(order.price?.toString() || '');
            setQuantity(order.quantity?.toString() || '');
            setPhotoPreview(order.photo);
            setComment(order.comment || '');
            setCheckService((order.check_service || order.checkService) as 'with-check' | 'without-check' || '');
            setConsolidation(order.consolidation ?? true);
            setRemovePostalPackaging(order.remove_postal_packaging || order.removePostalPackaging || false);
            setRemoveOriginalPackaging(order.remove_original_packaging || order.removeOriginalPackaging || false);
            setPhotoReport(order.photo_report || order.photoReport || false);
          }
        } catch (error) {
          console.error('Ошибка загрузки заказа:', error);
        }
      } else {
        setEditingId(null);
        setProductName('');
        setLink('');
        setPrice('');
        setQuantity('');
        setPhotoPreview(null);
        setComment('');
        setCheckService('');
        setConsolidation(true);
        setRemovePostalPackaging(false);
        setRemoveOriginalPackaging(false);
        setPhotoReport(false);
      }
    };
    loadEditingOrder();
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const orderData = {
        product_name: productName,
        link,
        price: parseFloat(price),
        quantity: parseInt(quantity) || 1,
        photo: photoPreview,
        warehouse_photo: null,
        comment,
        check_service: checkService,
        consolidation,
        remove_postal_packaging: removePostalPackaging,
        remove_original_packaging: removeOriginalPackaging,
        photo_report: photoReport,
        status: 'Ожидается на складе',
        status_date: new Date().toLocaleDateString('ru-RU'),
        track_number: `CN${Date.now()}`
      };

      if (editingId) {
        // Обновляем существующий товар
        await ordersStorage.update(editingId, orderData);
        localStorage.removeItem('editingOrderId');
      } else {
        // Создаем новый товар
        await ordersStorage.create(orderData);
      }
      
      onNavigate('orders');
    } catch (error: any) {
      console.error('❌ Ошибка сохранения заказа в CreateOrderScreen:', error);
      console.error('Тип ошибки:', error?.name);
      console.error('Сообщение:', error?.message);
      console.error('Stack:', error?.stack);
      alert(`Ошибка при сохранении заказа: ${error?.message || 'Неизвестная ошибка'}. Попробуйте еще раз.`);
    }
  };

  return (
    <div className="create-order-screen">
      <h1 className="screen-title">{editingId ? 'Редактировать товар' : 'Создать заказ'}</h1>
      
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label>Наименование товара</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Введите наименование товара"
            className="narrow-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Ссылка на товар</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className="narrow-input"
          />
        </div>

        <div className="form-group">
          <label>Цена за 1 шт (¥)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Введите цену"
            min="0"
            step="0.01"
            className="narrow-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Количество</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Введите количество"
            min="1"
            className="narrow-input"
            required
          />
        </div>

        <div className="form-group">
          <label>Фото товара</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="attach-photo-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            Прикрепить фото
          </button>
          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Preview" />
              <button
                type="button"
                className="remove-photo-btn"
                onClick={() => {
                  setPhoto(null);
                  setPhotoPreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Комментарий к товару</label>
          <small className="form-hint">Информация для склада или личного пользования</small>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Введите комментарий"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Услуги</label>
          <div className="service-options">
            <label className="service-option">
              <input
                type="radio"
                name="checkService"
                value="with-check"
                checked={checkService === 'with-check'}
                onChange={(e) => setCheckService('with-check')}
              />
              <span>С проверкой (100 руб/товар)</span>
              <button
                type="button"
                className="details-btn"
                onClick={() => setShowCheckDetails(!showCheckDetails)}
              >
                Подробнее
              </button>
            </label>
            {showCheckDetails && (
              <div className="service-details">
                <p>Услуга проверки товара включает визуальный осмотр и проверку соответствия заявленным характеристикам.</p>
              </div>
            )}
            
            <label className="service-option">
              <input
                type="radio"
                name="checkService"
                value="without-check"
                checked={checkService === 'without-check'}
                onChange={(e) => setCheckService('without-check')}
              />
              <span>Без проверки (Бесплатно)</span>
              <button
                type="button"
                className="details-btn"
                onClick={() => setShowNoCheckDetails(!showNoCheckDetails)}
              >
                Подробнее
              </button>
            </label>
            {showNoCheckDetails && (
              <div className="service-details">
                <p>Товар будет отправлен без дополнительной проверки.</p>
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Дополнительные услуги</label>
          <div className={`additional-services ${checkService !== 'with-check' ? 'disabled' : ''}`}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={consolidation}
                onChange={(e) => setConsolidation(e.target.checked)}
                disabled={checkService !== 'with-check'}
              />
              <span>Консолидация товара</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={removePostalPackaging}
                onChange={(e) => setRemovePostalPackaging(e.target.checked)}
                disabled={checkService !== 'with-check'}
              />
              <span>Убрать почтовую упаковку</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={removeOriginalPackaging}
                onChange={(e) => setRemoveOriginalPackaging(e.target.checked)}
                disabled={checkService !== 'with-check'}
              />
              <span>Убрать оригинальную упаковку</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={photoReport}
                onChange={(e) => setPhotoReport(e.target.checked)}
                disabled={checkService !== 'with-check'}
              />
              <span>Фотоотчет (149 руб/товар)</span>
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => onNavigate('orders')}>
            Отмена
          </button>
          <button type="submit" className="btn-primary">
            {editingId ? 'Сохранить изменения' : 'Создать товар'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrderScreen;
