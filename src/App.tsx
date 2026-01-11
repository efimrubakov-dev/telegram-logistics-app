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
    try {
      // Всегда устанавливаем белый фон и черный текст для надежности
      const bgColor = '#ffffff';
      const textColor = '#000000';
      
      // Применяем цвета сразу
      document.documentElement.style.setProperty('--tg-theme-bg-color', bgColor);
      document.documentElement.style.setProperty('--tg-theme-text-color', textColor);
      document.body.style.backgroundColor = bgColor;
      document.body.style.color = textColor;
      document.documentElement.style.backgroundColor = bgColor;
      
      const root = document.getElementById('root');
      if (root) {
        root.style.backgroundColor = bgColor;
        root.style.color = textColor;
      }
      
      // Инициализация Telegram WebApp (с обработкой ошибок)
      try {
        const tg = (window as any).Telegram?.WebApp;
        if (tg) {
          if (typeof tg.ready === 'function') {
            tg.ready();
          }
          if (typeof tg.expand === 'function') {
            tg.expand();
          }
          
          // Устанавливаем белый фон через Telegram API
          if (typeof tg.setBackgroundColor === 'function') {
            try {
              tg.setBackgroundColor('ffffff');
            } catch (e) {
              console.warn('Не удалось установить цвет фона через Telegram API:', e);
            }
          }
          
          // Получаем username из Telegram
          try {
            const user = tg.initDataUnsafe?.user;
            if (user?.username) {
              setTelegramUser(user.username);
            }
          } catch (e) {
            console.warn('Не удалось получить данные пользователя:', e);
          }
        }
      } catch (telegramError) {
        console.warn('Ошибка при инициализации Telegram WebApp:', telegramError);
        // Продолжаем работу без Telegram API
      }
    } catch (error) {
      console.error('Критическая ошибка при инициализации:', error);
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
