import { useState, useEffect } from 'react';
import type { ScreenType } from '../types';
import { ordersStorage } from '../services/storage';
import './OrdersScreen.css';

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

interface OrdersScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

function OrdersScreen({ onNavigate }: OrdersScreenProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [copiedTrack, setCopiedTrack] = useState<string | null>(null);
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());

  const loadOrders = async () => {
    try {
      const storedOrders = await ordersStorage.getAll();
      // Преобразуем формат данных из API в формат компонента
      const formattedOrders = storedOrders.map((order: any) => ({
        ...order,
        id: order.id.toString(),
        productName: order.product_name || order.productName,
        consolidation: Boolean(order.consolidation),
        removePostalPackaging: Boolean(order.remove_postal_packaging),
        removeOriginalPackaging: Boolean(order.remove_original_packaging),
        photoReport: Boolean(order.photo_report),
        trackNumber: order.track_number || order.trackNumber,
        statusDate: order.status_date || order.statusDate
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
    // Очищаем выделения при загрузке
    setSelectedOrders(new Set());
  }, []);

  const copyTrackNumber = (trackNumber: string) => {
    navigator.clipboard.writeText(trackNumber).then(() => {
      setCopiedTrack(trackNumber);
      setTimeout(() => setCopiedTrack(null), 2000);
    });
  };

  const getTotalPrice = (order: Order) => {
    return (order.price * order.quantity).toFixed(2);
  };

  const getTasks = (order: Order) => {
    const tasks = [];
    if (order.checkService === 'without-check') {
      tasks.push({ text: 'ТОВАР БЕЗ ПРОВЕРКИ', type: 'error' });
      if (order.removePostalPackaging) {
        tasks.push({ text: 'ОСТАВИТЬ ПОЧТОВУЮ УПАКОВКУ И МУСОР', type: 'default' });
      }
    } else if (order.checkService === 'with-check') {
      if (order.consolidation) {
        tasks.push({ text: 'КОНСОЛИДАЦИЯ ТОВАРА', type: 'default' });
      }
      if (order.removePostalPackaging) {
        tasks.push({ text: 'ОСТАВИТЬ ПОЧТОВУЮ УПАКОВКУ И МУСОР', type: 'default' });
      }
    }
    return tasks;
  };

  const handleToggleSelect = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.size === 0) return;
    if (window.confirm(`Вы уверены, что хотите удалить ${selectedOrders.size} товар(ов)?`)) {
      try {
        const idsToDelete = Array.from(selectedOrders);
        await ordersStorage.deleteMany(idsToDelete);
        await loadOrders(); // Перезагружаем список
        setSelectedOrders(new Set());
      } catch (error) {
        console.error('Ошибка удаления заказов:', error);
        alert('Ошибка при удалении заказов');
      }
    }
  };

  const handleEditSelected = () => {
    if (selectedOrders.size === 0) return;
    const orderId = Array.from(selectedOrders)[0];
    localStorage.setItem('editingOrderId', orderId);
    onNavigate('create-order');
  };

  return (
    <div className="orders-screen">
      <div className="orders-header">
        <h1 className="screen-title">Товары Ожидаются</h1>
        <button className="sort-btn">Сортировка</button>
      </div>
      
      <button 
        className="create-btn"
        onClick={() => {
          localStorage.removeItem('editingOrderId');
          onNavigate('create-order');
        }}
      >
        + Создать товар
      </button>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>У вас пока нет заказов</p>
          <p className="empty-subtitle">Создайте первый заказ, чтобы начать отслеживание</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-product-name-row">
                <input
                  type="checkbox"
                  checked={selectedOrders.has(order.id)}
                  onChange={() => handleToggleSelect(order.id)}
                  className="order-checkbox"
                />
                <div className="order-product-name">{order.productName}</div>
                {selectedOrders.has(order.id) && (
                  <span className="check-icon">✓</span>
                )}
              </div>
              
              <div className="order-info-row">
                <span className="order-label">Номер товара:</span>
                <span className="order-value">{order.trackNumber}</span>
              </div>

              <div className="order-info-row">
                <span className="order-label">Трек отслеживания:</span>
                <div className="track-number-wrapper">
                  <span className="order-value track-number">{order.trackNumber}</span>
                  <button
                    className="copy-track-btn"
                    onClick={() => copyTrackNumber(order.trackNumber)}
                    title="Копировать"
                  >
                    {copiedTrack === order.trackNumber ? '✓' : '📋'}
                  </button>
                </div>
              </div>

              {order.comment && (
                <div className="order-info-row">
                  <span className="order-label">Комментарий к товару:</span>
                  <span className="order-value">{order.comment}</span>
                </div>
              )}

              <div className="order-status-bar">
                <span className="order-label">Статус:</span>
                <span className="order-status">{order.status}</span>
              </div>

              <div className="order-info-row">
                <span className="order-label">Дата статуса:</span>
                <span className="order-value">{order.statusDate}</span>
              </div>

              <div className="order-info-row">
                <span className="order-label">Свойства:</span>
                <span className="order-value">-</span>
              </div>

              <div className="order-info-row">
                <span className="order-label">Количество:</span>
                <span className="order-value">{order.quantity} шт</span>
              </div>

              <div className="order-info-row">
                <span className="order-label">Стоимость:</span>
                <span className="order-value">{order.price.toFixed(2)} ¥</span>
              </div>

              <div className="order-info-row">
                <span className="order-label">Общая стоимость:</span>
                <span className="order-value">{getTotalPrice(order)} ¥</span>
              </div>

              {order.link && (
                <div className="order-info-row">
                  <span className="order-label">Ссылка:</span>
                  <a href={order.link} target="_blank" rel="noopener noreferrer" className="order-link">
                    Ссылка на товар
                  </a>
                </div>
              )}

              {getTasks(order).length > 0 && (
                <div className="order-tasks">
                  <span className="order-label">Задачи:</span>
                  <div className="tasks-list">
                    {getTasks(order).map((task, index) => (
                      <span
                        key={index}
                        className={`task-badge ${task.type === 'error' ? 'task-error' : 'task-default'}`}
                      >
                        {task.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {order.photo && (
                <div className="order-photo">
                  <span className="order-label">Фото клиента:</span>
                  <img 
                    src={order.photo} 
                    alt="Product" 
                    className="client-photo"
                    onClick={() => setEnlargedPhoto(order.photo!)}
                  />
                </div>
              )}

              <div className="order-photo">
                <span className="order-label">Фото со склада:</span>
                {order.warehousePhoto ? (
                  <img 
                    src={order.warehousePhoto} 
                    alt="Warehouse" 
                    className="client-photo"
                    onClick={() => setEnlargedPhoto(order.warehousePhoto!)}
                  />
                ) : (
                  <div className="no-photo-placeholder">
                    <span>Фото еще не загружено</span>
                  </div>
                )}
              </div>

              {selectedOrders.has(order.id) && (
                <div className="order-actions-bar">
                  <button
                    className="order-action-btn delete-action-btn"
                    onClick={async () => {
                      if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
                        try {
                          await ordersStorage.delete(order.id);
                          await loadOrders(); // Перезагружаем список
                          const newSelected = new Set(selectedOrders);
                          newSelected.delete(order.id);
                          setSelectedOrders(newSelected);
                        } catch (error) {
                          console.error('Ошибка удаления заказа:', error);
                          alert('Ошибка при удалении заказа');
                        }
                      }
                    }}
                  >
                    🗑️ Удалить
                  </button>
                  <button
                    className="order-action-btn edit-action-btn"
                    onClick={() => {
                      localStorage.setItem('editingOrderId', order.id);
                      onNavigate('create-order');
                    }}
                  >
                    ✏️ Редактировать
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {enlargedPhoto && (
        <div className="photo-modal" onClick={() => setEnlargedPhoto(null)}>
          <button 
            className="photo-modal-close"
            onClick={(e) => {
              e.stopPropagation();
              setEnlargedPhoto(null);
            }}
          >
            ✕
          </button>
          <img 
            src={enlargedPhoto} 
            alt="Enlarged" 
            className="photo-modal-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default OrdersScreen;
