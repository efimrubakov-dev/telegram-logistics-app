import type { ScreenType } from '../types';
import './BottomNav.css';

interface BottomNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
}

function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const isActive = (screen: ScreenType) => {
    return currentScreen === screen;
  };

  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${isActive('home') ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <span className="nav-icon">🌾</span>
        <span className="nav-label">Главная</span>
      </button>

      <button 
        className={`nav-item ${isActive('orders') ? 'active' : ''}`}
        onClick={() => onNavigate('orders')}
      >
        <span className="nav-icon">📦</span>
        <span className="nav-label">Мои заказы</span>
      </button>

      <button 
        className={`nav-item ${isActive('consolidations') ? 'active' : ''}`}
        onClick={() => onNavigate('consolidations')}
      >
        <span className="nav-icon">🧩</span>
        <span className="nav-label">Объединения</span>
      </button>

      <button 
        className={`nav-item ${isActive('check') ? 'active' : ''}`}
        onClick={() => onNavigate('check')}
      >
        <span className="nav-icon">❗</span>
        <span className="nav-label">Проверить</span>
      </button>
    </nav>
  );
}

export default BottomNav;
