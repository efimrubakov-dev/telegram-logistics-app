import { useState, useEffect } from 'react';
import './App.css';
import type { ScreenType } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import SideMenu from './components/SideMenu';
import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';
import ConsolidationsScreen from './screens/ConsolidationsScreen';
import CheckScreen from './screens/CheckScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreateOrderScreen from './screens/CreateOrderScreen';
import CreateConsolidationScreen from './screens/CreateConsolidationScreen';
import RecipientsScreen from './screens/RecipientsScreen';
import CreateRecipientScreen from './screens/CreateRecipientScreen';
import WarehouseAddressScreen from './screens/WarehouseAddressScreen';
import ProductsScreen from './screens/ProductsScreen';
import InstructionsScreen from './screens/InstructionsScreen';
import ParcelsScreen from './screens/ParcelsScreen';
import ShoppingHelpScreen from './screens/ShoppingHelpScreen';
import ProductsSentScreen from './screens/ProductsSentScreen';
import DeliveryAddressScreen from './screens/DeliveryAddressScreen';
import AddDeliveryAddressScreen from './screens/AddDeliveryAddressScreen';
import ProductsArchiveScreen from './screens/ProductsArchiveScreen';
import ProductsReturnsScreen from './screens/ProductsReturnsScreen';
import ProductsProblematicScreen from './screens/ProductsProblematicScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [telegramUser, setTelegramUser] = useState<string>('');

  // Инициализация Telegram WebApp
  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      
      // Получаем цвета из Telegram темы
      let bgColor = tg.themeParams?.bg_color || '#ffffff';
      let textColor = tg.themeParams?.text_color || '#000000';
      
      // Если цвет фона слишком темный (темная тема), используем светлую тему
      // Проверяем яркость цвета
      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };
      
      const rgb = hexToRgb(bgColor);
      if (rgb) {
        // Вычисляем яркость (luminance)
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        // Если фон слишком темный, используем светлую тему
        if (luminance < 0.5) {
          bgColor = '#ffffff';
          textColor = '#000000';
        }
      }
      
      // Используем Telegram API для установки фона (важно для мобильных устройств)
      if (tg.setBackgroundColor) {
        // Убираем # из цвета для API
        const bgColorHex = bgColor.replace('#', '');
        tg.setBackgroundColor(bgColorHex);
      }
      
      // Применяем цвета к документу
      document.documentElement.style.setProperty('--tg-theme-bg-color', bgColor);
      document.documentElement.style.setProperty('--tg-theme-text-color', textColor);
      document.body.style.backgroundColor = bgColor;
      document.body.style.color = textColor;
      document.documentElement.style.backgroundColor = bgColor;
      
      // Устанавливаем фон для root элемента
      const root = document.getElementById('root');
      if (root) {
        root.style.backgroundColor = bgColor;
        root.style.color = textColor;
      }
      
      // Получаем username из Telegram
      const user = tg.initDataUnsafe?.user;
      if (user?.username) {
        setTelegramUser(user.username);
      }
    } else {
      // Если не в Telegram, устанавливаем дефолтные значения
      const defaultBg = '#ffffff';
      const defaultText = '#000000';
      document.body.style.backgroundColor = defaultBg;
      document.body.style.color = defaultText;
      document.documentElement.style.backgroundColor = defaultBg;
      const root = document.getElementById('root');
      if (root) {
        root.style.backgroundColor = defaultBg;
        root.style.color = defaultText;
      }
    }
  }, []);

  // Функция для смены экрана
  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    setIsSideMenuOpen(false);
  };

  // Рендерим текущий экран
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigateTo} />;
      case 'orders':
        return <OrdersScreen onNavigate={navigateTo} />;
      case 'consolidations':
        return <ConsolidationsScreen onNavigate={navigateTo} />;
      case 'check':
        return <CheckScreen />;
      case 'calculator':
        return <CalculatorScreen />;
      case 'profile':
        return <ProfileScreen telegramUsername={telegramUser} />;
      case 'create-order':
        return <CreateOrderScreen onNavigate={navigateTo} />;
      case 'create-consolidation':
        return <CreateConsolidationScreen onNavigate={navigateTo} />;
      case 'recipients':
        return <RecipientsScreen onNavigate={navigateTo} />;
      case 'create-recipient':
        return <CreateRecipientScreen onNavigate={navigateTo} />;
      case 'warehouse-address':
        return <WarehouseAddressScreen />;
      case 'products':
        return <ProductsScreen />;
      case 'instructions':
        return <InstructionsScreen />;
      case 'parcels':
        return <ParcelsScreen />;
      case 'shopping-help':
        return <ShoppingHelpScreen />;
      case 'products-sent':
        return <ProductsSentScreen />;
      case 'delivery-address':
        return <DeliveryAddressScreen onNavigate={navigateTo} />;
      case 'add-delivery-address':
        return <AddDeliveryAddressScreen onNavigate={navigateTo} />;
      case 'products-archive':
        return <ProductsArchiveScreen />;
      case 'products-returns':
        return <ProductsReturnsScreen />;
      case 'products-problematic':
        return <ProductsProblematicScreen />;
      default:
        return <HomeScreen onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="app">
      <Header 
        onMenuClick={() => setIsSideMenuOpen(true)} 
        onLogoClick={() => navigateTo('home')}
        onProfileClick={() => navigateTo('profile')}
      />
      
      <SideMenu 
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        onNavigate={navigateTo}
        currentScreen={currentScreen}
      />

      <main className="main-content">
        {renderScreen()}
      </main>

      <BottomNav 
        currentScreen={currentScreen}
        onNavigate={navigateTo}
      />
    </div>
  );
}

export default App;
