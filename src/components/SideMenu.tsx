import { useState, useEffect } from 'react';
import type { ScreenType } from '../types';
import './SideMenu.css';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenType) => void;
  currentScreen: ScreenType;
}

function SideMenu({ isOpen, onClose, onNavigate, currentScreen }: SideMenuProps) {
  const [isProductsExpanded, setIsProductsExpanded] = useState(false);
  const [isParcelsExpanded, setIsParcelsExpanded] = useState(false);
  const [isAddressesExpanded, setIsAddressesExpanded] = useState(false);

  // Автоматически раскрывать раздел при открытии меню, если текущий экран в его подразделах
  useEffect(() => {
    if (isOpen) {
      // Экраны, относящиеся к разделу "Товары"
      const productsScreens: ScreenType[] = ['orders', 'products', 'products-sent', 'products-problematic', 'products-returns', 'products-archive'];
      // Экраны, относящиеся к разделу "Посылки"
      const parcelsScreens: ScreenType[] = ['parcels'];
      // Экраны, относящиеся к разделу "Адреса"
      const addressesScreens: ScreenType[] = ['warehouse-address', 'delivery-address'];

      if (productsScreens.includes(currentScreen)) {
        setIsProductsExpanded(true);
        setIsParcelsExpanded(false);
        setIsAddressesExpanded(false);
      } else if (parcelsScreens.includes(currentScreen)) {
        setIsParcelsExpanded(true);
        setIsProductsExpanded(false);
        setIsAddressesExpanded(false);
      } else if (addressesScreens.includes(currentScreen)) {
        setIsAddressesExpanded(true);
        setIsProductsExpanded(false);
        setIsParcelsExpanded(false);
      } else {
        setIsProductsExpanded(false);
        setIsParcelsExpanded(false);
        setIsAddressesExpanded(false);
      }
    }
  }, [isOpen, currentScreen]);

  const handleNavigate = (screen: ScreenType) => {
    onNavigate(screen);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="side-menu-overlay" onClick={onClose}></div>
      <div className={`side-menu ${isOpen ? 'open' : ''}`}>
        <div className="side-menu-header">
          <button className="side-menu-close" onClick={onClose}>✕</button>
        </div>
        
        <nav className="side-menu-nav">
          <button 
            className={`side-menu-item ${currentScreen === 'home' ? 'active' : ''}`}
            onClick={() => handleNavigate('home')}
          >
            <span className="side-menu-icon">🌾</span>
            <span>Главная</span>
          </button>

          <div className="side-menu-section">
            <button 
              className={`side-menu-item side-menu-item-expandable ${['orders', 'products', 'products-sent', 'products-problematic', 'products-returns', 'products-archive'].includes(currentScreen) ? 'active' : ''}`}
              onClick={() => {
                setIsProductsExpanded(!isProductsExpanded);
                setIsParcelsExpanded(false);
                setIsAddressesExpanded(false);
              }}
            >
              <div className="side-menu-item-content">
                <span className="side-menu-icon">📦</span>
                <span>Товары</span>
              </div>
              <span className={`side-menu-arrow ${isProductsExpanded ? 'expanded' : ''}`}>
                ▼
              </span>
            </button>

            <div className={`side-menu-submenu ${isProductsExpanded ? 'expanded' : ''}`}>
              <button 
                className={`side-menu-subitem ${currentScreen === 'orders' ? 'active' : ''}`}
                onClick={() => handleNavigate('orders')}
              >
                <span>Ожидают поступления на склад</span>
              </button>
              <button 
                className={`side-menu-subitem ${currentScreen === 'products' ? 'active' : ''}`}
                onClick={() => handleNavigate('products')}
              >
                <span>Товары на складе</span>
              </button>
              <button 
                className={`side-menu-subitem ${currentScreen === 'products-sent' ? 'active' : ''}`}
                onClick={() => handleNavigate('products-sent')}
              >
                <span>Отправленные</span>
              </button>
              <button 
                className={`side-menu-subitem ${currentScreen === 'products-problematic' ? 'active' : ''}`}
                onClick={() => handleNavigate('products-problematic')}
              >
                <span>*Проблемные</span>
              </button>
              <button 
                className={`side-menu-subitem ${currentScreen === 'products-returns' ? 'active' : ''}`}
                onClick={() => handleNavigate('products-returns')}
              >
                <span>*Возвраты</span>
              </button>
              <button 
                className={`side-menu-subitem ${currentScreen === 'products-archive' ? 'active' : ''}`}
                onClick={() => handleNavigate('products-archive')}
              >
                <span>*Архив</span>
              </button>
            </div>
          </div>

          <div className="side-menu-section">
            <button 
              className={`side-menu-item side-menu-item-expandable ${currentScreen === 'parcels' ? 'active' : ''}`}
              onClick={() => {
                setIsParcelsExpanded(!isParcelsExpanded);
                setIsProductsExpanded(false);
                setIsAddressesExpanded(false);
              }}
            >
              <div className="side-menu-item-content">
                <span className="side-menu-icon">📮</span>
                <span>Посылки</span>
              </div>
              <span className={`side-menu-arrow ${isParcelsExpanded ? 'expanded' : ''}`}>
                ▼
              </span>
            </button>

            <div className={`side-menu-submenu ${isParcelsExpanded ? 'expanded' : ''}`}>
              <button 
                className={`side-menu-subitem ${currentScreen === 'parcels' ? 'active' : ''}`}
                onClick={() => handleNavigate('parcels')}
              >
                <span>В обработке</span>
              </button>
              <button 
                className={`side-menu-subitem ${currentScreen === 'parcels' ? 'active' : ''}`}
                onClick={() => handleNavigate('parcels')}
              >
                <span>Отправленные</span>
              </button>
              <button 
                className={`side-menu-subitem ${currentScreen === 'parcels' ? 'active' : ''}`}
                onClick={() => handleNavigate('parcels')}
              >
                <span>*Архив</span>
              </button>
            </div>
          </div>

          <button 
            className={`side-menu-item ${currentScreen === 'recipients' || currentScreen === 'create-recipient' ? 'active' : ''}`}
            onClick={() => handleNavigate('recipients')}
          >
            <span className="side-menu-icon">👥</span>
            <span>Получатели</span>
          </button>

          <div className="side-menu-section">
            <button 
              className={`side-menu-item side-menu-item-expandable ${['warehouse-address', 'delivery-address'].includes(currentScreen) ? 'active' : ''}`}
              onClick={() => {
                setIsAddressesExpanded(!isAddressesExpanded);
                setIsProductsExpanded(false);
                setIsParcelsExpanded(false);
              }}
            >
              <div className="side-menu-item-content">
                <span className="side-menu-icon">🏠</span>
                <span>Адреса</span>
              </div>
              <span className={`side-menu-arrow ${isAddressesExpanded ? 'expanded' : ''}`}>
                ▼
              </span>
            </button>

            <div className={`side-menu-submenu ${isAddressesExpanded ? 'expanded' : ''}`}>
              <button 
                className={`side-menu-subitem ${currentScreen === 'warehouse-address' ? 'active' : ''}`}
                onClick={() => handleNavigate('warehouse-address')}
              >
                <span>Адрес склада в Китае</span>
              </button>
              <button 
                className={`side-menu-subitem ${currentScreen === 'delivery-address' ? 'active' : ''}`}
                onClick={() => handleNavigate('delivery-address')}
              >
                <span>Адрес доставки по РФ</span>
              </button>
            </div>
          </div>

          <button 
            className={`side-menu-item ${currentScreen === 'calculator' ? 'active' : ''}`}
            onClick={() => handleNavigate('calculator')}
          >
            <span className="side-menu-icon">🧮</span>
            <span>Калькулятор</span>
          </button>
        </nav>
      </div>
    </>
  );
}

export default SideMenu;
